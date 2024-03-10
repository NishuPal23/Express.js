const mongoose = require("mongoose")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    name:{
        type : String,
        require :[true,"user name is required"],
        minLength :[1,"name must be of 1 length"],
        maxLength:[60,"name length not greater than 60"],
        trim : true
    },
    email : {
        type:String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type :String
    },
    forgetPasswordToken : {
        type : String
    },
    passwordExpiryDate :{
        type : Date
    }
},{timestamps : true})
userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id:this._id, email:this._email},
            process.env.SECRET,
            {expiresIn:"24h"}
        )
    }
}
userSchema.pre('save', async function(next){
    if(!this.isModified('password'))return next()
    this.password = await bcrypt.hash(this.password,10)
    return next();
})

const userModel = mongoose.model("user",userSchema)
module.exports = userModel