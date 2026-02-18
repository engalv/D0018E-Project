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
