const Student = require("../models/studentModel"); //importing schemas
const mongoose = require("mongoose"); //importing mongoose
const ObjectId = mongoose.Types.ObjectId;
//post function
//post function not needed again cause of the create instructor function see authController.js
// Get all colleagues (students)
exports.getColleagues = async (req, res) => {
  try {
    const students = await Student.find({}, "first_name last_name _id"); //the main difference between this and the get all function is that in get collegues what the info of all the student gotten can be specified i.e you can choose what you want the endpoint to return

    res.status(200).send({
      status: "success",
      data: students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get one colleague function
exports.getOneColleague = async (req, res) => {
  try {
    const { colleagueId } = req.params;
    const student = await Student.findById(colleagueId, "email id"); //would return the specified info about one colleague

    if (!student) {
      return res.status(404).send({
        status: "error",
        message: "colleague not found",
      });
    }
    res.status(200).send({
      status: "success",
      data: student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all function
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.find(); //would return all info
    res.status(201).send({
      status: "success",
      count: student.length,
      data: student,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//get one function
exports.getOneStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId); //would return all info about the student with the id input
    if (!student) {
      return res.status(404).send({
        status: "error",
        message: "student not found",
      });
    }
    res.status(200).send({
      status: "sucesss",
      data: student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//update function
exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;
    const student = await Student.findByIdAndUpdate(studentId, updateData, {
      new: true,
    });

    if (!student) {
      return res.status(404).send({
        status: "error",
        message: "student not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update course for a single student endpoint
exports.updateStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courses } = req.body; // Expecting an array of course IDs or names

    const student = await Student.findByIdAndUpdate(
      studentId,
      { courses },
      { new: true }
    );

    if (!student) {
      return res.status(404).send({
        status: "error",
        message: "Student not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: student,
      message: "Courses updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete function
exports.deleteStudent = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await Student.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "student not found" });
    }

    res.status(200).json({ message: "student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
