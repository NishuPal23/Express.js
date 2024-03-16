const mongoose = require("mongoose")
const MONGODB_URL = process.env.MONGODB_URL
const databaseConnection = ()=>{
    mongoose
    .connect("mongodb://127.0.0.1/my_database")
    .then((conn)=>{
        console.log(`Connect to database ${conn.connection.host}`)
    })
    .catch((err)=>{
        console.log(err)
    })
}   
module.exports = databaseConnection