const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql12345678910!!!A",
  database: "scheme"
});

conn.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

// If user already has an active cart then we retrieve the UID,
// if the UID has no cart, create a new cart for them
async function getActiveCartID(uid) {
  const [rows] = await conn.promise().query(
    "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
    [uid]
  );

  if (rows.length) return rows[0].CID;

  const [result] = await conn.promise().query(
    "INSERT INTO cart (UID, Status) VALUES (?, 'active')",
    [uid]
  );

  return result.insertId; // insertID is the primary key of the new cart (CID) 
}

// Display products on frobtpage
app.get("/product", (req, res) => {
  conn.query("SELECT * FROM product", (err, result) => {
    if (err) {
      console.error("Query error:", err);
    }
    res.json(result);
  });
});

// Get cart belogning to specific user
app.get("/cart/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );

    if (!cartRows.length) return res.json([]);

    const cartID = cartRows[0].CID;

    const [items] = await conn.promise().query(
      `SELECT ci.CIID, ci.PID, ci.Quantity, p.Name, p.Price, p.Stock
       FROM cart_item ci
       JOIN product p ON ci.PID = p.PID
       WHERE ci.CID = ?`,
      [cartID]
    );

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong when fetching the cart" });
  }
});

// Add new product to cart
app.post("/cart/add", async (req, res) => {
  const { uid, pid, quantity } = req.body;

  try {
    const [productRows] = await conn.promise().query(
      "SELECT Stock FROM product WHERE PID = ?",
      [pid]
    );
    if (!productRows.length) return res.status(404).json({ error: "Product not found" });

    const stock = productRows[0].Stock;
    if (quantity > stock) return res.status(400).json({ error: "Not enough stock" });

    const cartID = await getActiveCartID(uid);

    const [cartItemRows] = await conn.promise().query(
      "SELECT Quantity FROM cart_item WHERE CID = ? AND PID = ?",
      [cartID, pid]
    );

    if (cartItemRows.length) {
      const newQuantity = cartItemRows[0].Quantity + quantity;
      if (newQuantity > stock) return res.status(400).json({ error: "Not enough stock" });

      await conn.promise().query(
        "UPDATE cart_item SET Quantity = ? WHERE CID = ? AND PID = ?",
        [newQuantity, cartID, pid]
      );
    } else {
      await conn.promise().query(
        "INSERT INTO cart_item (CID, PID, Quantity) VALUES (?, ?, ?)",
        [cartID, pid, quantity]
      );
    }

    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error when adding item to cart" });
  }
});

// Update quantity of cart
app.post("/cart/update", async (req, res) => {
  const { uid, pid, quantity } = req.body;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );
    if (!cartRows.length) return res.status(400).json({ error: "No active cart" });
    const cartID = cartRows[0].CID;

    const [productRows] = await conn.promise().query(
      "SELECT Stock FROM product WHERE PID = ?",
      [pid]
    );
    await conn.promise().query(
      "UPDATE cart_item SET Quantity = ? WHERE CID = ? AND PID = ?",
      [quantity, cartID, pid]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cart updating error" });
  }
});

// Remove product from cart
app.post("/cart/remove", async (req, res) => {
  const { uid, pid } = req.body;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );
    if (!cartRows.length) return res.status(400).json({ error: "No active cart" });

    const cartID = cartRows[0].CID;

    await conn.promise().query(
      "DELETE FROM cart_item WHERE CID = ? AND PID = ?",
      [cartID, pid]
    );
  } catch (err) {
    console.error(err);
  }
});

// Checkout cart
app.post("/cart/checkout", async (req, res) => {
  const { uid } = req.body;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );
    if (!cartRows.length) return res.status(400).json({ error: "No active cart" });

    const cartID = cartRows[0].CID;

    const [items] = await conn.promise().query(
      `SELECT ci.PID, ci.Quantity, p.Stock
       FROM cart_item ci
       JOIN product p ON ci.PID = p.PID
       WHERE ci.CID = ?`,
      [cartID]
    );

    for (const item of items) {
      await conn.promise().query(
        "UPDATE product SET Stock = Stock - ? WHERE PID = ?",
        [item.Quantity, item.PID]
      );
    }

    await conn.promise().query(
      "UPDATE cart SET Status = 'inactive' WHERE CID = ?",
      [cartID]
    );

    res.json({ message: "Checkout successful" });
  } catch (err) {
    console.error(err);
  }
});

// Clear cart
app.delete("/cart/clear/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );
    if (!cartRows.length) return res.json({ message: "Cart already empty" });

    const cartID = cartRows[0].CID;

    await conn.promise().query(
      "DELETE FROM cart_item WHERE CID = ?",
      [cartID]
    );

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
  }
});

// Registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).send("Missing fields");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO user (Name, Email, Password) VALUES (?, ?, ?)";

    conn.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Registration error:", err);
      }
    });

  } catch (err) {
    console.error("Hashing error:", err);
  }
});

// Logging in
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM user WHERE Email = ?";
  conn.query(sql, [email], async (err, results) => {
    const user = results[0];
    const valid = await bcrypt.compare(password, user.Password);
    res.send({
      user: { UID: user.UID, Name: user.Name, Is_Admin: user.Is_Admin }
    });
  });
});

app.listen(5000, () => console.log("Running on localhost:5000"));
