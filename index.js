//import exxpress into our app es5 way
const express = require("express");
const db = require("./dbConn/conn");
const authRoute = require("./routes/authRoute")
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes")

const app = express();


db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to database"))


//using this middleware to process request from consumers 
app.use(express.json());

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

app.listen(777, () => {
    console.log(`app listening on port 777`);
});

//importing routes
app.use("/api/v1", studentRoutes);
app.use("/api/v1", authRoute);
app.use("/api/v1", courseRoutes);

