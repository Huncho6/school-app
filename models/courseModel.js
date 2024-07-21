//schema for course more info in read.md
const mongoose = require("mongoose");

const { Schema } = mongoose;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  instructors: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
    required: false,
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

const course = mongoose.model("course", courseSchema);

module.exports = course;
