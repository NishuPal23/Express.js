const {signup, signin , getStudent} = require("../controller/studentController.js")
const express = require("express")
const jwtAuth = require("../middleware/jwtAuth.js")
const studRoute = express.Router();
studRoute.post("/signup",signup);
studRoute.post("/signin",signin);
studRoute.get("/student",jwtAuth, getStudent);
module.exports = studRoute