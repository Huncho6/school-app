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
    gender:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    address: {
    type: String,
    required: false,
    },
  email:{
    type: String,
      required: true,
    lowercase: true,
    },
  phone_number:{
    type: String,
    required: true,
    },
    courses:{
    type: [mongoose.Schema.Types.ObjectId],
    required: true
    },
    gitHub:{
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
    dafault : Date.now,
    },
});

const instructor = mongoose.model("instructor", instructorSchema);

module.exports = instructor;