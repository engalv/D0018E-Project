const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT
});

conn.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

module.exports = conn;