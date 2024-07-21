const { Router } = require("express");
const {
  createCourse,
  getCourse,
  getOneCourse,
  assignInstructorToCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = Router();

const getOneCourseMiddleware = (req, res, next) => {
  console.log("this is a middleware that gets a single course");
  next();
};

const createCourseMiddleware = (req, res, next) => {
  console.log("this is a middleware that post a course");
  next();
};

router.post("/course", createCourseMiddleware, createCourse); //create course function with it's middlewate
router.get("/course", getCourse); //get course function
router.get("/course/:courseId", getOneCourseMiddleware, getOneCourse); //get one course function
router.put("/course/:courseId/assign-instructor", assignInstructorToCourse); //assign instructor to a course would need to input the instructor id in the body when testing
router.put("/course/:id", updateCourse); //update  course fuction
router.delete("/course/:id", deleteCourse); //delete course function

module.exports = router;
