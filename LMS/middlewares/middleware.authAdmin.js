//import jwt from "jsonwebtoken"
import ApiError from "../utils/error.util.js"
// Middleware to check if user is admin or not
const authorizeRoles = (...roles) => (async (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to view this route", 403)
      );
    }

    next();
  });
  export {authorizeRoles} 