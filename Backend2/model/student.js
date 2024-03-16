const mongoose = require("mongoose")
const JWT = require("jsonwebtoken")

const studentSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true,"student name required"],
        maxLength: [50,"length of name not exceeded than 50"],
        minLength : [1,"length of name at least 1"],
        trim : true
    },
    email : {
        type :String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required:true
    },
    address: {
        type : String,
        
    }

})
studentSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id:this._id, email:this._email},
            process.env.SECRET,
            {expiresIn:'24h'}            
            )
    }
}
const studentModel = mongoose.model("student",studentSchema)
module.exports = studentModel