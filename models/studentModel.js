//student schema more info in read.md
const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  other_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    validate: (v) => v > 18 && v < 60,
  },
  role: {
    // To define if user is instructor or student
    type: String,
    default: "student",
  },
  password: {
    type: String,
    required: true,
    validate: (v) => v.length > 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  courses: {
    type: [String], // Array of course names or IDs
    required: false,
  },
  resetToken: String, // these fields are added so that the token generated from the forget password can save directly to database before using it to change password
  expireToken: Date,
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
