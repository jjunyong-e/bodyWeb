const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "grom0419",
  database: "bodyWebDB",
});

db.connect();

module.exports = db;
