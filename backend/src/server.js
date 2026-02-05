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
  database: "testschema"
});

con.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

app.get("/products", (req, res) => {
  con.query("SELECT * FROM product", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
