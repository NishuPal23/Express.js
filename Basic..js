const express = require("express");
const app = express();
const port = 8080
app.get('/',(req,res)=>{
    res.send("hello world");
})
app.get('/about',(req,res)=>{
    res.send("this is about page")
})
app.use('/contact',(req,res)=>{
    res.end("this is contact page")
})
app.listen(port,()=>{
     console.log(`server running at port ${port} `)
})