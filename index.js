//import exxpress into our app es5 way
const express = require("express");
const cors = require("cors");
const db = require("./dbConn/conn");
const authRoute = require("./routes/authRoute");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoute");
//destructuring and importing middlewares
const {
  verifyToken,
  isStudent,
  isInstructor,
} = require("./middlewares/authMiddleware");

const app = express();

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to database"));

//using this middleware to process request from consumers
app.use(express.json());
app.use(cors()); // installing cors to allow access in the frontend
//creating a middleware
const welcomeMessage = (req, res, next) => {
  console.log("ekaabo");
  //this is used to move to the next midlleware
  next();
};
const thankYou = (req, res, next) => {
  console.log("goodbye");
  next();
};

//this execute for every route on this server
app.use(welcomeMessage);

app.use(thankYou);

app.listen(775, () => {
  console.log(`app listening on port 775`);
});

//importing routes
//unprotected route for incase i want to get one student,instructor,login and create account
app.use("/api/v1", courseRoutes);
app.use("/api/v1", studentRoutes);
app.use("/api/v1", instructorRoutes);
app.use("/api/v1", authRoute); //important for logging in and creating account
//we have import auth route before student and instructor because of the way js read codes
//protected routes for after login need authorization as the key and the token gotten from logging in as the value
app.use("/api/v1", verifyToken, isStudent, studentRoutes);
//did this and the i discovered i can't do a normal get all request after (verifyToken and isstudent&&isinstructor is added)
app.use("/api/v1", verifyToken, isInstructor, instructorRoutes);
