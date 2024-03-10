const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL 
const databaseConnect = ()=>{
    mongoose
            .connect(MONGODB_URL)
            .then((conn)=>console.log(`connect to db ${conn.connection.host}`))
            .then((err)=>console.log(err))
}
module.exports = databaseConnect