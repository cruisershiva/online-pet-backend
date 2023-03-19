const express=require("express");
const app=express();
const errormiddleware = require("./middleware/error");
const cookieparser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// app.use(function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });

// app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieparser());


//route imports
const pets=require("./routes/petsroute.js");
const petfood=require("./routes/petfoodroute.js");
const petmedicine=require("./routes/petmedicineroute.js"); 
const pettoy=require("./routes/pettoyroute.js");
const user = require("./routes/userroute"); 
const order = require("./routes/orderroute");


app.use("/api/v1",pets);
app.use("/api/v1",petfood);
app.use("/api/v1",petmedicine);
app.use("/api/v1",pettoy);
app.use("/api/v1", user);
app.use("/api/v1",order);
// app.use("/api/v1", order);

//middleware for errors
app.use(errormiddleware);





module.exports=app;