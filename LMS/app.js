import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import userRoutes from "./routes/user.routes.js"
import courseRoutes from "./routes/course.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js"
const app = express();
//to get data of req,body in json form
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//to unable to communicate with frontend also credentials true indicate that cookie allow to navigate
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    Credentials : true
}))
//to parse cookie
app.use(cookieParser())

//while accessing different api we get message in console which api we try to hit . it is basically logger middleware
app.use(morgan("dev"))
//check server is working or not
app.use("/ping",function(req,res){
    res.send("/pong")
})
//routes of three module
//userRoutes indicate to routes/user.route.js
//user releated all api come here
app.use("/api/vi/user",userRoutes);

//for courses
app.use("/api/vi/course",courseRoutes);

//for payment
app.use("/api/vi/payments",paymentRoutes);

//if user hit other url other them above 3 then show error
app.all("*",(req,res)=>{
    res.status(404).send("oops! 404 page not found")
})
//flow is like that when error come in userRoutes then there we use next which tell do the next step of it so it come back here  check next step what it can do so it come to errorMiddleware
 app.use(errorMiddleware)
//now export it 
export default app;