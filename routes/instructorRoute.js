const { Router } = require("express");
const {
  getInstructor,
  getOneInstructor,
  updateInstructor,
  deleteInstructor,
} = require("../controllers/instructorController");

const router = Router();

const getOneInstructorMiddleware = (req, res, next) => {
  console.log("this is a middleware that gets a single student");
  next();
};

router.get("/instructor", getInstructor); //get
router.get(
  "/instructor/:instructorId",
  getOneInstructorMiddleware,
  getOneInstructor
); //get one
router.put("/instructor/:id", updateInstructor); //update
router.delete("/instructor/:id", deleteInstructor); //delete

module.exports = router;
