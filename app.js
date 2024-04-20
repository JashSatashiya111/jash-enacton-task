// Importing required modules
const dbConnect = require("./config/db");
const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 3000;
const app = express();
const cors = require("cors");
const path = require('path');

// Connecting to the database
dbConnect();

// Middleware setup
app.use(express.json()); // Parse incoming request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes for controllers
app.use("/brand", require("./controller/brand"));
app.use("/category", require("./controller/category"));
app.use("/product", require("./controller/product"));
app.use("/upload", require("./controller/upload"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Global error handling functions
global.setError = (msg, code) => {
  if (!code) {
    code = 400;
  }
  let err = new Error(msg);
  err.status = code;
  return err;
};
global.throwError = (err, code = 400) => {
  if (typeof err === 'string') {
    throw setError(err, code);
  } else {
    throw err;
  }
};

// Error handling middleware
app.use(function (err, req, res, next) {
  let error = err.message.replace('Error: ', '')
  console.log(error);
  res.status(err.status || 500).send({ error });
});

// Function to convert id to ObjectId
const { ObjectId } = require('mongodb');
global.ObjectIds = (ids) => {
  let convertedIds = [];
  if (Array.isArray(ids)) {
    for (const id of ids) {
      convertedIds.push(new ObjectId(id));
    }
  }
  return convertedIds;
};

// Test route
app.get("/", (req, res) => {
  res.send("testing..");
});

// Start the server
app.listen(port, (req, res) => {
  console.log("Server Running on " + port);
});
