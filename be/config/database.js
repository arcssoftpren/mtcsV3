const db = require("mysql2");
require("dotenv").config();
const connection = db.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.DB_NAME,
});

exports.connection = connection;
