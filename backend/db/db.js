const mysql = require("mysql2/promise");

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "admin", // lmao
  database: "veterinarydb",
};

const connection = mysql.createPool(config);

module.exports = connection;
