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
// // Middleware to check if user is admin or not
//  const authorizeRoles = (...roles) => (async (req, _res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ApiError("You do not have permission to view this route", 403)
//       );
//     }

//     next();
//   });
export default isLoggedIn;
  

