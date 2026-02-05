let mysql = require('mysql2');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql12345678910!!!A",
    database: "testschema"
})

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM product", function (err, result, fields) {
    if (err) throw err;
    console.log("Detta är result", result);
    console.log("Detta är fields:", fields)
    })
  console.log("Connected!");
});