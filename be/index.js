require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();

const IP = process.env.SERVER_IP || "127.0.0.1";
const PORT = process.env.SERVER_PORT || 3000;

app.use(
  cors({ origin: "*", methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"] })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.get("/", (req, res) => res.send("Hello World!"));

const connection = require("./config/database").connection;
connection.getConnection((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  console.log("Connected to the database");
});

app.use("/api", require("./routes"));

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = http.createServer(app);

server.listen(PORT, IP, () => {
  console.log(`Server running at http://${IP}:${PORT}/`);
});
