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
    duration:{
      type: Number,
        required: true,
      },
      requirement:{
      type: String,
      required: false,
      },
      price:{
          type: Number,
          required: false,
      },
      instructor: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
      },
      students: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
      },
      createdAt: {
        type: Number, 
        dafault : Date.now,
      },
  });
  
  const course = mongoose.model("course", courseSchema);
  
  module.exports = course;