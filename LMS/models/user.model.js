import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
const userSchema = new mongoose.Schema({
       fullName : {
        type : 'String',
        required : [true,"Name is required"],
        minLength :[3,"Name must be at least 5 character"],
        maxLength : [20,"Name not exceeded than 20 characer"],
        lowercase: true,
        trim: true

       },
       email:{
        type : 'String',
        required : true,
        unique : true,
        match :[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill in a valid email address',]

       },
       password:{
        type:'String',
        required : [true,"password is required"],
        minLength :[4,"password must be at least 6 length"],
        select : false
       }, 
       avatar:{
        public_id : {
            type : 'String'
        },
        secure_url : {
            type : 'String'
        }
       },
       role:{
        type :'String',
        enum:['USER','ADMIN'],
        default : 'USER'
       },
       forgotPasswordToken: 'String',
       forgotPasswordExpiry:Date,
       subscription:{
        id:'String',
        status:'String'
       }
},
{timestamps:true}
)

//encrypt password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})


//generate token
userSchema.methods = {
    generateJWTToken : async function(){
        return await jwt.sign(
            {
            id:this.id, email : this.email,subscription: this.subscription,role:this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn : process.env.JWT_EXPIRY
        }
        )
        
    },
    comparePassword : async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password)
    },
    generatePasswordResetToken : async function(){
        const resetToken = crypto.randomBytes(20).toString('hex')
        this.forgotPasswordToken = crypto.createHash('Sha256').update(resetToken).digest('hex');
        this.forgotPasswordExpiry = Date.now()+15*60*1000
    }
}

const User = mongoose.model("User",userSchema);
export default User