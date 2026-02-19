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

// --- Helper: get or create active cart ---
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

  return result.insertId; // returns the new CID
}

// --- Products ---
app.get("/product", (req, res) => {
  conn.query("SELECT * FROM product", (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).send(err.sqlMessage || err);
    }
    res.json(result);
  });
});

// --- Fetch user's cart ---
app.get("/cart/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const [cartRows] = await conn.promise().query(
      "SELECT CID FROM cart WHERE UID = ? AND Status = 'active'",
      [uid]
    );

    if (!cartRows.length) return res.json([]); // empty cart

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
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// --- Add product to cart ---
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
    res.status(500).json({ error: "/cart/add error" });
  }
});

// --- Update quantity ---
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
    if (!productRows.length) return res.status(404).json({ error: "Product not found" });

    if (quantity < 1 || quantity > productRows[0].Stock)
      return res.status(400).json({ error: "Invalid quantity" });

    await conn.promise().query(
      "UPDATE cart_item SET Quantity = ? WHERE CID = ? AND PID = ?",
      [quantity, cartID, pid]
    );

    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "/cart/update error" });
  }
});

// --- Remove product ---
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

    res.json({ message: "Product removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "/cart/remove error" });
  }
});

// --- Checkout ---
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
    res.status(500).json({ error: "/cart/checkout error" });
  }
});

// --- Clear cart without checkout ---
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
    res.status(500).json({ error: "/cart/clear/:uid error" });
  }
});

// --- Registration ---
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).send("Missing fields");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO user (Name, Email, Password) VALUES (?, ?, ?)";
    conn.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Registration error:", err);
        return res.status(500).send("Error creating user: " + err.sqlMessage);
      }
      res.send("User registered successfully");
    });
  } catch (err) {
    console.error("Hashing error:", err);
    res.status(500).send("Server error");
  }
});

// --- Login ---
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Missing fields");

  const sql = "SELECT * FROM user WHERE Email = ?";
  conn.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length === 0) return res.status(401).send("User not found");

    const user = results[0];
    const valid = await bcrypt.compare(password, user.Password);
    if (!valid) return res.status(401).send("Incorrect password");

    res.send({
      message: "Login successful",
      user: { UID: user.UID, Name: user.Name, Is_Admin: user.Is_Admin }
    });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
