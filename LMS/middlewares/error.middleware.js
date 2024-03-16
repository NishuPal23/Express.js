const errorMiddleware = (err,req,res,next)=>{
    //if we forget to give statuscode or message in controller AppError object then it take it from here
    err.statusCode = err.statusCode ||500
    err.message = err.message || "Something went wrong"
    return res.status(err.statusCode).json({
        success : false,
        message: err.message,
        stack:err.stack
    })
}

export default errorMiddleware
//now use it in app.js