const app=require("./app");
const dotenv=require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase=require("./config/database");
const serviceRoute = require('./service');
const snippetsRoute = require('./snippets');
const express = require('express');

//handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log("shutting down the server due to uncaught exception");
  process.exit(1);
});

//config
dotenv.config({path:"backend/config/config.env"});



//connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
});

app.use('/', express.static(__dirname + '/webpage'));

app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/webpage/index.html");
});

app.post("/", function(req, res) {
    res.sendFile(__dirname + "/webpage/index.html");
    res.send("Success!!!");
});


app.use('/', snippetsRoute);
app.use('/service', serviceRoute);

// app.listen(process.env.PORT|6005, () => console.log("Server is running on http://localhost:"));

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});