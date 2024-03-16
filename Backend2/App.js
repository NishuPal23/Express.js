const express = require("express");
const studRouter = require("./router/studentRoute.js");
const databaseConnection = require("./config/databaseConfig.js");
const app = express();
databaseConnection();
app.use(express.json())
app.use("/app2/auth/",studRouter)
app.use("/",(req,res)=>{
    return res.status(200).json({
        success: true,
        data : "Home Page"
    })
})


module.exports = app