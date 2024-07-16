const mongoose = require("mongoose");

mongoose.connect(
    'mongodb+srv://ibrahim489:Huncho66@ibrahim.3vlz281.mongodb.net/school-app?retryWrites=true&w=majority&appName=ibrahim'
);

const db = mongoose.connection;

module.exports = db;


