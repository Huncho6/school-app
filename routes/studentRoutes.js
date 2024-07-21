//specifying routes see more info in read.md
const { Router } = require("express");
const {
  getColleagues,
  getOneColleague,
  getStudent,
  getOneStudent,
  updateStudent,
  updateStudentCourses,
  deleteStudent,
} = require("../controllers/studentController");

const router = Router();

const getOneStudentMiddleware = (req, res, next) => {
  console.log("this is a middleware that gets a single student");
  next();
};

const createStudentMiddleware = (req, res, next) => {
  console.log("this is a middleware that post a student");
  next();
};

router.get("/students/colleagues", getColleagues); //get all colleagues function should return only name and id of all students
router.get("/students/colleagues/:colleagueId", getOneColleague); //get one function //get all colleagues function should return only email and id of the students
router.get("/student", getStudent); //normal get functiion
router.get("/student/:studentId", getOneStudentMiddleware, getOneStudent); //normal get one functiion
router.put("/student/:id", updateStudent);
router.put("/student/:studentId/courses", updateStudentCourses); //this is used to update the courses the student is offering
router.delete("/student/:id", deleteStudent);

module.exports = router;
