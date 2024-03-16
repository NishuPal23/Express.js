import ApiError from "../utils/error.util.js"
import User from "../models/user.model.js"


const cookieOptions = {
    maxAge : 7*24*60*60*1000,
    httpOnly:true,
    secure : true
}
//register
const register =async (req,res,next)=>{
    //first user write their details on register form so firstly get this information from req.body
    const{fullName,email,password} = req.body
    if(!fullName || !email ||!password){
        //it retur instance of AppError so we send it to next i.e middleware to send erreor to user
        return next(new ApiError("every field required",400))
        
    }
    //now check user exist or not
    //if exist then give error
    const userExist = await User.findOne({email})
    if(userExist){
        return next(new ApiError("email already exist",400));
    }
    //if not exist then create user
    const user = await User.create({
        fullName,
        email,
        password,
        avatar :{
            public_id : email,
            //secure_id:
        }
    })
    if(!user){
        return next(new ApiError("user regisstration failed",400));
    }

    //file upload

    //save user
    await user.save();

    //now user registered successfully so make him able to login
    //so for login first generate token
    //token generation
    user.password = undefined;
    const token = await user.generateJWTToken();
    res.cookie('token',token,cookieOptions);
    res.status(200).json({
        success:true,
        message : "user registered successfully",
        user
    })


}

//login
const login = async (req,res)=>{
    
        try{
            const {email, password}= req.body
            if(!email || !password){
                return next(new ApiError('All field required',400))
            }
            const user = await User.findOne({email}).select("+password")
            if(!user ||!user.comparePassword(password)){
                return next(new ApiError('email or password does mot match',400))
            }
            const token = await user.generateJWTToken();
            user.password = undefined
            res.cookie('token',token,cookieOptions);
            res.status(200).json({
                success:true,
                message : "user login successfully",
                user
            })
        }catch(e){
            return next(new ApiError(e.message,400))
    }
}


//logout
const logout = (req,res)=>{
      res.cookie('token',null,{
          secure : true,
          maxAge : 0,
          httpOnly: true
      })
      res.status(200).json({
        success : true,
        message : "user logout succssfully"
      })
}

//getProfile
const getProfile = async(req,res)=>{
      try{
        const userId = req.user.id;
        const user = await User.findById(userId)
        res.status(200).json({
            success : true,
            message : "user profile",
            user
        })
      }catch(e){
        return next(new ApiError("failed to fetch profile",400))
      }
}

export {register,login,logout,getProfile}