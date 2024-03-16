const app = require("./App.js")
require("dotenv").config();
app.listen(process.env.PORT,()=>{
    console.log(`server start at port no : ${process.env.PORT}`)
})