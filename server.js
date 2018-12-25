"use strict";
//node modules
const express = require("express"),
  app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

//custom objects
let port = 8000;

let AuthSys = require("./AuthSys");
let config = require("./Config/database");
//creating database connection
mongoose.Promise = global.Promise;
mongoose.connect(
  config.db,
  { useNewUrlParser: true }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

//app.use(express.bodyParser());

app.set("port", port);

app.use(express.static(path.join(__dirname)));
app.use("/api/authSys", AuthSys.router);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    console.log("Invalid Token! Please Login Again");
    res.json({ message: "Invalid Token! Please Login Again" });
  }
});
app.get("/api/check", function(req, res) {
  res.json({ message: "Invalid Token! Please Login Again" });
});
app.listen(app.get("port"), function() {
  console.log("server running on port", app.get("port"));
});
