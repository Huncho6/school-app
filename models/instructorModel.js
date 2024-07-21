//instructor schema more info in read.md
const mongoose = require("mongoose");

const { Schema } = mongoose;

const instructorSchema = new Schema({
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
  gender: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  address: {
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
  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  role: {
    //to define if user is instructor or student
    type: String,
    default: "instructor",
  },
  gitHub: {
    type: String,
    required: true,
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
  resetToken: String, // these fields are added so that the token generated from the forget password can save directly to database before using it to change password
  expireToken: Date,
});

const instructor = mongoose.model("instructor", instructorSchema);

module.exports = instructor;
