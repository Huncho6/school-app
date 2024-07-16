const Student = require("../models/studentModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.createStudent = async (req,res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send({
            status: "sucess",
            message: "Student created sucessfully"
        });
    }catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getStudent = async (req,res) => {
    try {
        const student = await Student.find();
        res.status(201).send({
            status: "success",
            count: student.length,
            data: student,
        })

    }catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getOneStudent = async (req, res) => {
    try{
        const student = await Student.findById(req.params.studentId);
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
    } catch (error){
        res.status(500).json({message: error.message})
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const updateData = req.body;
        const student = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
        
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