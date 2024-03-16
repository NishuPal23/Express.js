const emailValidation = require("email-validator")
const studentModel = require("../model/student.js")

//signup
const signup = async (req,res,next)=>{
    const{name,email,password,confirmPassword} = req.body;
    console.log(name,email,password,confirmPassword)

    try{
        const studentInfo = studentModel(req.body)
        console.log("student info " ,studentInfo)
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                success : false,
                message : "every field required"
            })
        }
        if(password!==confirmPassword){
            return res.status(400).json({
                success: false,
                message : "password does not match with confirm password"
    
            })
        }
        const validEmail = emailValidation.validate(email)
        if(!validEmail){
            return res.status(400).json({
                success: false,
                message : "Provide valid email"
    
            })
        }
        const storeToDb =await studentInfo.save()
        return res.status(200).json({
            success:true,
            data : storeToDb
        })
    }catch(e){
        if(e.code ===11000){
            return res.status(400).json({
                success: false,
                message : "email already exist"
    
            })
        }
        return res.status(400).json({
            success: false,
            message : e.message

        })
    }
   
}

//signin
const signin = async (req,res)=>{
    const {email,password} = req.body
    if(!email && !password){
        return res.tatus(400).json({
            success:false,
            message:"every field is mandatory"
        })
    }
    try{
        const user = await studentModel.findOne({
            email
        }).select("+password")
        console.log("user",user)
        if(!user || user.password!==password){
            return res.stauus(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token = user.jwtToken();
        console.log("token",token)
        user.password = undefined
        console.log("token",token)
        const cookieOption = {
            maxAge : 24*60*60*1000,
            httpOnly : true
        }
        res.cookie("token",token,cookieOption)
        return res.status(200).json({
            success:true,
            data:user
        })
    }catch(e){
        return res.status(400).json({
            success: false,
            message : e.message
        })
    }
    
}

//getStudent
 const getStudent = async (req,res,next)=>{
    const userId = req.user.id
    try{
        const user = await studentModel.findById(userId)
        return res.status(200).json({
            success: true,
            data:user
        })
    }catch(e){
        return res.status(400).json({
            success: false,
            message : e.message
        })
    }
 }
module.exports = {signup, signin,getStudent}