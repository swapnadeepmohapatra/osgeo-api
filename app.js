const express = require("express");
const morgan = require("morgan");
const mysql = require("mysql");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("./public"));

app.use(morgan("short"));

app.get("/", (req, res) => {
  res.send("Please refer to the doccumentation for more info");
});

const router = require("./routes/user");

app.use(router);

app.listen(3005, () => {
  console.log("sever is up");
});