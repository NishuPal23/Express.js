const express = require("express");
const authRouter = require("./router/authRoute.js")
const databaseConnect = require("./config/databaseConfig")
const cookieParser = require("cookie-parser")
const app = express();
databaseConnect();
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth/",authRouter)
app.use("/",(req,res)=>{
    res.status(200).json({data:"JWT Auth Server"})
})
module.exports = app