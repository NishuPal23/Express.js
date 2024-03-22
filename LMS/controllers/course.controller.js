import Course from "../models/course.model.js"
import cloudinary from "cloudinary";
import fs from 'fs/promises'
import ApiError from "../utils/error.util.js"
//import path from "path";

const getAllCourses = async function(req,res,next){
    try{
        const courses = await Course.find({}).select('-lectures');
        res.status(200).json({
            success : true,
            message :"All courses",
            courses
        })
    }catch(e){
        return next(new ApiError(e.message,500));
      }
        
}

//get all lectures
const getLecturesByCourseId = async function(req,res,next){
      try{
        const{id} = req.params;
        const course = await Course.findById(id);
        res.status(200).json({
            success: true,
            message : " Get All lectures",
            lectures : course.lectures
        })
      }catch(e){
        return next(new ApiError(e.message,500));
      }
}

//create course
const createCourse = async(req,res,next)=>{
        const{title,description,category,createdBy} = req.body;
        if(!title || !description || !category || !createdBy){
            return next(new ApiError(Error||"All fields required",400))
        }

        const course = await Course.create({
          title,
          description,
          category,
          createdBy,
          thumbnail :{
            public_id : "dummy",
            secure_url:"dummy",
        }
        })
        if(!course){
          return next(new ApiError("course could not create, please try again",400))
        }
        if(req.file){
          console.log(req.file)
          try{
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
              folder:'lms'
            })
            if(result){
              course.thumbnail.public_id= result.public_id,
              course.thumbnail.secure_url = result.secure_url
            }
            fs.rm(`uploads/${req.file.filename}`);
  
            await course.save();
            res.status(200).json({
              success : true,
              message: "course created successfully",
              course
            })
          }catch(e){
            return next(new ApiError("not able to find file",400))
          }
          
        }
}


//update course
const updateCourse = async function(req,res,next){
        try{
           const {id} = req.params;
           const course = await Course.findByIdAndUpdate(
            id,
            {
              $set : req.body
            },
            {
               runValidators : true
            }
           )
           if(!course){
            return next(new ApiError("course not found",400))
           }
           res.status(200).json({
            success : true,
            message : "course update successfull",
            course
           })

        }catch(e){
          return next(new ApiError(e.message,400))
        }
}

//delete course
const removeCourse = async function(req,res,next){
          try{
            const {id} = req.params
            const course = await Course.findById(id);
            if(!course){
              return next(new ApiError("course not found",400))
            }
            await Course.findByIdAndDelete(id);
            res.status(200).json({
              success : true,
              message : "course remove successfull",
              course
             })
            
          }catch(e){
            return next(new ApiError(e.message,400))
          }

}

//add lecture by id
const addLectureById = async(req,res,next)=>{
  const { title, description } = req.body;
  const { id } = req.params;

  

  if (!title || !description) {
    return next(new ApiError('Title and Description are required', 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new ApiError('Invalid course id or course not found.', 400));
  }
   const lectureData = {
    title,
    description,
    lecture : {}
   };
   if(req.file){
    try{
      const result = await cloudinary.v2.uploader.upload(req.file.path,{
        folder:'lms'
      })
      if(result){
        lectureData.lecture.public_id= result.public_id,
        lectureData.lecture.secure_url = result.secure_url
      }
      fs.rm(`uploads/${req.file.filename}`);

      await course.save();
      res.status(200).json({
        success : true,
        message: "course created successfully",
        course
      })
    }catch(e){
      return next(new ApiError("not able to find file",400))
    }
   }
  // Run only if user sends a file
  

  course.lectures.push(
     lectureData
  );

  course.numberOfLectures = course.lectures.length;

  // Save the course object
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course lecture added successfully',
    course,
  });

}
export {getAllCourses,getLecturesByCourseId,createCourse,updateCourse,removeCourse,addLectureById}
