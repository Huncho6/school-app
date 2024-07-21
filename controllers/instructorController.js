const Instructor = require("../models/instructorModel"); //importing schemas
const mongoose = require("mongoose"); //importing mongoose
const ObjectId = mongoose.Types.ObjectId;
//post function not needed again cause of the create instructor function see authController.js
//get all function
exports.getInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.find();
    res.status(201).send({
      status: "success",
      count: instructor.length,
      data: instructor,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//get one function
exports.getOneInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.instructorId);
    if (!instructor) {
      return res.status(404).send({
        status: "error",
        message: "instructor not found",
      });
    }
    res.status(200).send({
      status: "sucesss",
      data: instructor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//put function to update and field in instructor
exports.updateInstructor = async (req, res) => {
  try {
    const instructorId = req.params.id;
    const updateData = req.body;
    const instructor = await Instructor.findByIdAndUpdate(
      instructorId,
      updateData,
      { new: true }
    );

    if (!instructor) {
      return res.status(404).send({
        status: "error",
        message: "not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: instructor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete function
exports.deleteInstructor = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await Instructor.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "instructor not found" });
    }

    res.status(200).json({ message: "instructor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
