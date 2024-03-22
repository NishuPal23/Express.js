import {Router} from "express"
import {getAllCourses,getLecturesByCourseId,createCourse,updateCourse,removeCourse,addLectureById} from "../controllers/course.controller.js"
import isLoggedIn from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/middleware.authAdmin.js";

import upload from "../middlewares/multer.middleware.js"
const router = Router();
router.route("/").get(getAllCourses)
.post(isLoggedIn,authorizeRoles('ADMIN'), upload.single('thumbnail'),createCourse)

router.route("/:id").get(isLoggedIn,getLecturesByCourseId)
.put(isLoggedIn,authorizeRoles('ADMIN'),updateCourse)//because we want id also here
.delete(isLoggedIn,authorizeRoles('ADMIN'),removeCourse)
.post(isLoggedIn,authorizeRoles('ADMIN'),upload.single('lecture'),addLectureById);
export default router;