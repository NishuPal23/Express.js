const userModel = require("../model/userSchema.js")
const emailValidator = require("email-validator")
const signup = async(req,res,next)=>{
    const{name,email,password,confirmPassword} = req.body
    console.log(name,email,password,confirmPassword)
    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            success : false,
            message : "every field required"
        })
    }
    const validEmail = emailValidator.validate(email);
    if(!validEmail){
        return res.status(400).json({
            success : false,
            message : "Please provide valid email"
        })
    }
    if(password!==confirmPassword){
        return res.status(400).json({
            success : false,
            message : "Password does not match with confirm password"
        })
    }
    try{
        const userInfo = userModel(req.body)
        const result = await userInfo.save()
    
        return res.status(200).json({
             success:true,
            data:result
        })
   }catch(e){
        if(e.code ===11000){
           return res.status(400).json({
            success : false,
            message : "user already exist"
           })
        }
        return res.status(400).json({
            success : false,
            message : e.message
        })
   }
}

//signin
const signin = async(req,res)=>{
    const{email,password}=req.body;
    if(!email ||!password){
        res.status(400).json({
            success : false,
            message :"every field is mandatory"
        })
    }
    try{
    const user = await userModel.findOne({
        email
    }).select("+password")
    if(!user ||password!==user.password){
        res.status(400).json({
            success : false,
            message :"invalid credentials"
        })
    }
    const token = user.jwtToken();
    user.password = undefined;
    const cookieOption = {
        maxAge : 24*60*60*1000,
        httpOnly:true
    }
    res.cookie("token",token,cookieOption)
    res.status(200).json({
        success : true,
        data : user
    })
    }catch(e){
        res.status(400).json({
            success : false,
            message : e.message
        })
    }

}

module.exports = {signup, signin}