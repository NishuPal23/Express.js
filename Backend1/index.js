require("dotenv").config();
const PORT = process.env.PORT || 8080
const app = require("./app.js")
app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`)
})