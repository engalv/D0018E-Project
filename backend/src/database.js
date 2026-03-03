const mysql = require("mysql2");

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

module.exports = conn;