import app from "./app.js"
//we import env configuration only at starting point means index.js or server.js to use it anywhere
import { config } from 'dotenv'
import cloudinary from 'cloudinary'
config()
import dbConnect from "./config/dbConnection.js"
const PORT = process.env.PORT || 8080
cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})
app.listen(PORT,async()=>{
    //call dbConnect method which is define in config/sbConnection file to connect with db . here we check that we connect with db or ot
    await dbConnect()
    console.log(`Server is running at port ${PORT}`)
})