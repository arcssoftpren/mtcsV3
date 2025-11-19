const db = require("mysql2");
require("dotenv").config();
const connection = db.createPool({
  host: "localhost",
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

exports.connection = connection;
