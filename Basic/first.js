const express = require("express")
const port = 8080
const app = express();
app.get("/",(req,res)=>{
    res.send("Home page")
})
app.get("/about",(req,res)=>{
    res.send("About Page")
})
app.use("/contact",(req,res)=>{
    res.status(200).json({data:"conatct"})
})
app.listen(port,()=>{
    console.log(`srver running at port ${port}`)
})