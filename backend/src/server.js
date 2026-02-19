const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

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

// Load in Products

app.get("/product", (req, res) => {
  conn.query("SELECT * FROM product", (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).send(err.sqlMessage || err);
    }
    res.json(result);
  });
});

app.get("/cart/:uid", (req, res) => {
  const uid = req.params.uid;
  const sql = `SELECT product.PID,
      product.Name,
      product.Price,
      product.Stock,
      cart.Product_Quantity AS Quantity
    FROM cart
    JOIN product ON cart.PID = product.PID
    WHERE cart.UID = ?`;
  con.query(sql, [uid], (err, result) => {
    if (err) return res.json();
    res.json(result);
  });
});


app.post("/cart/add", async (req, res) => {
  const { uid, pid, quantity } = req.body;

  try {
    const [productRows] = await con.promise().query("SELECT Stock FROM product WHERE PID = ?", [pid]);
    if (!productRows.length) return res.status(404).json({ error: "Product not found" });

    const stock = productRows[0].Stock;
    if (quantity > stock) 
      return res.json("");

    const [cartRows] = await con.promise().query("SELECT Product_Quantity FROM cart WHERE UID = ? AND PID = ?", [uid, pid]);

    if (cartRows.length) {
      const newQuantity = cartRows[0].Product_Quantity + quantity;
      
      if (newQuantity > stock) 
        return res.json("");

      await con.promise().query("UPDATE cart SET Product_Quantity = ? WHERE UID = ? AND PID = ?", [newQuantity, uid, pid]);
        res.json({ message: "Kundvagnen uppdaterad" });
    } else {
      await con.promise().query("INSERT INTO cart (UID, PID, Product_Quantity) VALUES (?, ?, ?)", [uid, pid, quantity]);
        res.json({ message: "Produkt inlagd" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "/cart/add error" });
  }
});


app.post("/cart/update", async (req, res) => {
  const { uid, pid, quantity } = req.body;

  try {
    const [productRows] = await con.promise().query("SELECT Stock FROM product WHERE PID = ?", [pid]);

    if (quantity > productRows[0].Stock || quantity < 1)
      return res.status(400).json("Lagersaldot är ogiltigt");

    await con.promise().query("UPDATE cart SET Product_Quantity = ? WHERE UID = ? AND PID = ?", [quantity, uid, pid]);
      res.json({ message: "Produkt uppdaterad" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "/cart/update error" });
  }
});


app.post("/cart/remove", (req, res) => {
  try {
  const { uid, pid } = req.body;
  con.query("DELETE FROM cart WHERE UID = ? AND PID = ?", [uid, pid], () => {
    res.json("Produkt borttagen");
  });
  } catch (err) {
    console.error(err);
    res.status(500).json("/cart/remove error");
  }
});


app.post("/cart/checkout", async (req, res) => {
  const { uid } = req.body;
  try {
    const [cartItem] = await con.promise().query(`
      SELECT c.PID, c.Product_Quantity AS Quantity, p.Stock
      FROM cart c
      JOIN product p ON c.PID = p.PID
      WHERE c.UID = ?
    `, [uid]);

    for (const product of cartItem) {
      await con.promise().query("UPDATE product SET Stock = Stock - ? WHERE PID = ?", [product.Quantity, product.PID]);
    }

    await con.promise().query("DELETE FROM cart WHERE UID = ?", [uid]);
      res.json("Rensade kundvagnen");

  } catch (err) {
    console.error(err);
    res.status(500).json("/cart/checkout error");
  }
});

app.delete("/cart/checkout/:uid", (req, res) => {
  try {
  const uid = req.params.uid;
  con.query("DELETE FROM cart WHERE UID = ?", [uid], err => {
    res.json("Rensade kundvagnen");
  });
  } catch (err) {
    console.error(err);
    res.status(500).json("/cart/checkout/:uid error");
  }
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

// --- Login Endpoint ---
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

    res.send({ message: "Login successful", user: { UID: user.UID, Name: user.Name, Is_Admin: user.Is_Admin } });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
