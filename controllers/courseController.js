const Course = require("../models/courseModel"); //importing schema
const mongoose = require("mongoose"); //importing mongoose
const ObjectId = mongoose.Types.ObjectId;

//post function
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).send({
      status: "sucess",
      message: "Course created sucessfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//get all function
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.find();
    res.status(201).send({
      status: "success",
      count: course.length,
      data: course,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//get one course function
exports.getOneCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send({
        status: "error",
        message: "course not found",
      });
    }
    res.status(200).send({
      status: "sucesss",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//function for updating or putting course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updateData = req.body;
    const course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    if (!course) {
      return res.status(404).send({
        status: "error",
        message: "course not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//function Assign an instructor to a course
exports.assignInstructorToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { instructorId } = req.body;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { instructors: instructorId } }, // addToSet to ensure no duplicates
      { new: true }
    );

    if (!course) {
      return res.status(404).send({
        status: "error",
        message: "Course not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: course,
      message: "Instructor assigned successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete course
exports.deleteCourse = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await Course.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "course not found" });
    }

    res.status(200).json({ message: "course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
