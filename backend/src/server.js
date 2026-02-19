const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql12345678910!!!A",
  database: "scheme"
});

con.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

app.get("/products", (req, res) => {
  con.query("SELECT * FROM product", (err, result) => {
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
});

app.listen(5000, () => console.log("Server running on port 5000"));
