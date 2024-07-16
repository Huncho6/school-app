const { Router } = require("express"); 
const {
    createCourse,
    getCourse,
    getOneCourse,
    // updateCourse,
    // deleteCourse,
}= require("../controllers/courseController");

const router = Router();

const getOneCourseMiddleware = (req, res, next) =>{
    console.log("this is a middleware that gets a single course");
    next();
};

const createCourseMiddleware = (req, res, next) =>{
    console.log("this is a middleware that post a course");
    next();
};

router.post("/course", createCourseMiddleware,createCourse);
router.get("/course", getCourse);
router.get("/course/:courseId", getOneCourseMiddleware,getOneCourse);
// router.put("/course/:courseId", updateCourse);
// router.delete("/course/:courseId",deleteCourse);

module.exports = router;