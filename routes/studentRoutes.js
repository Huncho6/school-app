const { Router } = require("express"); 
const {
    createStudent,
    getStudent,
    getOneStudent,
    updateStudent,
    deleteStudent,
}= require("../controllers/studentController");

const router = Router();

const getOneStudentMiddleware = (req, res, next) =>{
    console.log("this is a middleware that gets a single student");
    next();
};

const createStudentMiddleware = (req, res, next) =>{
    console.log("this is a middleware that post a student");
    next();
};

router.post("/student", createStudentMiddleware,createStudent);
router.get("/student", getStudent);
router.get("/student/:studentId", getOneStudentMiddleware,getOneStudent);
router.put("/student/:id", updateStudent);
router.delete("/student/:id",deleteStudent)

module.exports = router;