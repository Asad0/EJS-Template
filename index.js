const { Console } = require("console");
const express=require("express");
const app=express();
var session = require('express-session')
const controller=require("./controller")
require('dotenv').config()
const db=require("./db")
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded())
app.use(session({
    secret: ']*m/"MCYQ2,u+jUJ',
    resave: false,
    saveUninitialized: true,
    
  }))
app.listen(process.env.PORT,()=>{console.log("Server Run At "+process.env.PORT)});
app.use("/",controller);