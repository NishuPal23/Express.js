import mongoose from "mongoose"
//In Mongoose, by default, queries are strict, meaning that any query options or conditions that are not defined in the schema will be ignored. However, setting 'strictQuery' to false relaxes this behavior, allowing queries to be executed even if they contain fields that are not explicitly defined in the schema.
mongoose.set('strictQuery',false)
const MONGODB_URI = process.env.MONGODB_URI
const dbConnect  = async ()=>{
    try{
        const {connection} = await mongoose.connect(process.env.MONGODB_URI);
        //console.log(connection)
        if(connection){
        console.log(`Connected to mongodb ${connection.host}`)
      }
    }
    catch(e){
        console.log(e);
        process.exit();
    }
      
}
export default dbConnect
//now move to server.js to call dbConnect method