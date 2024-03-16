import jwt from "jsonwebtoken"
import ApiError from "../utils/error.util.js"
const isLoggedIn = async(req,res,next)=>{
    const { token} = req.cookies;
    if(!token){
        return next(new ApiError("please login again"),400)
    }
    const userDetails = await jwt.verify(token,process.env.JWT_SECRET)
    req.user = userDetails
    next();
}
export default isLoggedIn