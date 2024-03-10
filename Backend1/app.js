const express = require("express");
const authRouter = require("./router/authRoute.js")
const databaseConnect = require("./config/databaseConfig")
const app = express();
app.use(express.json())
databaseConnect();
app.use("/api/auth/",authRouter)
app.use("/",(req,res)=>{
    res.status(200).json({data:"JWT Auth Server"})
})
module.exports = app