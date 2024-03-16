class ApiError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode,
        Error.captureStackTrace(this,this.constructor)
    }
}
export default ApiError

/**Error.captureStackTrace(this, this.constructor): This function captures the current stack trace and assigns it to the this object, which typically refers to the instance of the Error being created. The this.constructor argument specifies the constructor function of the Error instance, ensuring that the stack trace begins at the point of instantiation of the Error.
By capturing the stack trace, you preserve information about the sequence of function calls that led to the creation of the Error object. This stack trace can be useful for debugging purposes, as it provides insight into the execution flow of the code and helps identify the source of errors. */
//if ew clg(obj.stack) then it show where error occur