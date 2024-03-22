import ApiError from "../utils/error.util.js"
import User from "../models/user.model.js"
import fs from'fs/promises'
import cloudinary from 'cloudinary'
import sendEmail from '../utils/sendEmail.js';
//import crypto from "crypto"


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
            secure_url:
        'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        }
    })
    if(!user){
        return next(new ApiError("user registration failed",400));
    }

    //file upload
    if(req.file){
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder : 'lms',
                width : 250,
                height : 250,
                gravity : 'face',
                crop : 'fill'
            })
            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_id = result.secure_url;
                fs.rm(`uploads/${req.file.filename}`)
            }
        }catch(error){
            return next(new ApiError( 'File not uploaded, please try again', 400))
        }
    }

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
const logout = (req,res,next)=>{
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
const getProfile = async(req,res,next)=>{
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


//forgot password
const forgotPassword = async(req,res,next)=>{
    const{email} = req.body;
    if(!email){
        return next(new ApiError("every field required",400))
    }
    const user = await User.findOne({email});
    if(!user){
        return next(new ApiError("email nt registered",400))
    }
    const resetToken = await user.generatePasswordResetToken
    await user.save();
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    // We here need to send an email to the user with the token
  const subject = 'Reset Password';
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;
  try{
    await sendEmail(email,subject,message);
    res.status(200).json({
        success : true,
        messsage :`Reset password token has been send to ${email} successfully`
    })
  }catch(e){
    // If some error happened we need to clear the forgotPassword* fields in our DB
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    return next(
      new ApiError(
        e.message || 'Something went wrong, please try again.',
        500
      )
    )
  }
}


//reset password
const resetPassword = async(req,res,next)=>{
    const{ resetToken  } = ewq.params;
    const { password} = req.body;
    const forgotPasswordToken = crypto.createHash('Sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
        forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() } // $gt will help us check for greater than value, with this we can check if token is valid or expired
    });
    if (!user) {
        return next(
          new ApiError('Token is invalid or expired, please try again', 400)
        );
      }
    
      // Update the password if token is valid and not expired
      user.password = password;
    
      // making forgotPassword* valus undefined in the DB
      user.forgotPasswordExpiry = undefined;
      user.forgotPasswordToken = undefined;
    
      // Saving the updated user values
      await user.save();
    
      // Sending the response when everything goes good
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
}


//change password
const changePassword = (async (req, res, next) => {
    // Destructuring the necessary data from the req object
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user; // because of the middleware isLoggedIn
  
    // Check if the values are there or not
    if (!oldPassword || !newPassword) {
      return next(
        new ApiError('Old password and new password are required', 400)
      );
    }
  
    // Finding the user by ID and selecting the password
    const user = await User.findById(id).select('+password');
  
    // If no user then throw an error message
    if (!user) {
      return next(new ApiError('Invalid user id or user does not exist', 400));
    }
  
    // Check if the old password is correct
    const isPasswordValid = await user.comparePassword(oldPassword);
  
    // If the old password is not valid then throw an error message
    if (!isPasswordValid) {
      return next(new AppError('Invalid old password', 400));
    }
  
    // Setting the new password
    user.password = newPassword;
  
    // Save the data in DB
    await user.save();
  
    // Setting the password undefined so that it won't get sent in the response
    user.password = undefined;
  
    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  });


//updateUser
/**
 * @UPDATE_USER
 * @ROUTE @POST {{URL}}/api/v1/user/update/:id
 * @ACCESS Private (Logged in user only)
 */
 const updateUser = (async (req, res, next) => {
    // Destructuring the necessary data from the req object
    const { fullName } = req.body;
    const { id } = req.user.id;
  
    const user = await User.findById(id);
  
    if (!user) {
      return next(new ApiError('Invalid user id or user does not exist'));
    }
  
    if (fullName) {
      user.fullName = fullName;
    }
  
    // Run only if user sends a file
    if (req.file) {
      // Deletes the old image uploaded by the user
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms', // Save files in a folder named lms
          width: 250,
          height: 250,
          gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
          crop: 'fill',
        });
  
        // If success
        if (result) {
          // Set the public_id and secure_url in DB
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
  
          // After successful upload remove the file from local storage
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new ApiError(error || 'File not uploaded, please try again', 400)
        );
      }
    }
  
    // Save the user object
    await user.save();
  
    res.status(200).json({
      success: true,
      message: 'User details updated successfully',
    });
  });

export {register,login,logout,getProfile,resetPassword,changePassword,updateUser,forgotPassword}