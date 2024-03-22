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
  // Middleware to check if user has an active subscription or not
 const authorizeSubscribers = async (req, _res, next) => {
  // If user is not admin or does not have an active subscription then error else pass
  if (req.user.role !== "ADMIN" && req.user.subscription.status !== "active") {
    return next(new ApiError("Please subscribe to access this route.", 403));
  }

  next();
};
  export {authorizeRoles,authorizeSubscribers} 