const Instructor = require("../models/instructorModel"); //importing instructor schema
const Student = require("../models/studentModel"); //importing student schema
const crypto = require("crypto"); //crypto is a random token generator that help to generate otp for for the forget password function
const bcrypt = require("bcrypt"); //importing bcrypt after installation
const jwt = require("jsonwebtoken"); //importing jsonwebtoken
const dotenv = require("dotenv"); //importing dotenv
dotenv.config();
//function to create account
exports.createAccount = async (req, res) => {
  try {
    const { account } = req.params;
    const { password } = req.body;
    console.log(password);

    const hashedPassword = await bcrypt.hash(password, 10); //can be replaced with gen.salt //a unique identifier for user that have the same password
    console.log(password, "password");
    console.log(hashedPassword, "hashedPassword");
    req.body.password = hashedPassword; //assigning the normal password to the the hashed password

    if (account === "student") {
      //for student
      try {
        const isUserExist = await Student.findOne({ email: req.body.email }); //check for
        if (isUserExist) {
          //if the email already exists
          return res.status(400).send({
            status: "error",
            message: "user already exists",
          });
        }
        const student = new Student(req.body); //if he doesn't exist create account
        await student.save();
        res.status(201).json({
          status: "sucsess",
          message: "student created successfully",
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else if (account === "instructor") {
      //for instructor
      try {
        const isUserExist = await Instructor.findOne({ email: req.body.email });
        if (isUserExist) {
          //if user exist
          return res.status(400).send({
            status: "error",
            message: "user already exists",
          });
        }
        const instructor = new Instructor(req.body); //if he doesn't exist create account
        await instructor.save();
        res.status(201).send({
          status: "sucsess",
          message: "instructor created successfully",
        });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//function to login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; //destructuring email and password
    const { account } = req.params;
    if (!email || !password) {
      //for if user doesn't provide one of the email or password
      return res
        .status(404)
        .json({ message: "Please provide an email and password" });
    }
    if (account === "instructor") {
      //if account is instructor validation
      const instructor = await Instructor.findOne({ email }); //for correct email
      if (!instructor) {
        return res.status(404).json({ message: "Invalid credentials" }); //if email is not correct
      }
      const isCorrectPassword = await bcrypt.compare(
        //for correct password
        password,
        instructor.password
      );
      if (!isCorrectPassword) {
        //incorrect password
        return res.status(404).json({ message: "Invaild credentials" });
      }
      //token/access for instructor if password is correct
      const token = jwt.sign(
        {
          id: instructor._id,
          role: "instructor",
        },
        process.env.SECRET_KEY, //secret key from our dotenv file
        { expiresIn: "1h" } //expiration time
      );
      res.status(200).json({
        //for when all fields are correct
        status: "success",
        data: {
          token,
          instructor: {
            _id: instructor._id,
            name: instructor.name,
            email: instructor.email,
          },
        },
        message: "Instructor logged in successfully",
      });
    } else if (account === "student") {
      //ditto for student
      const student = await Student.findOne({ email });
      if (!student) {
        4;
        return res.status(404).json({ message: "Invalid credentials" });
      }
      const isCorrectPassword = await bcrypt.compare(
        password,
        student.password
      );
      if (!isCorrectPassword) {
        return res.status(404).json({ message: "Invaild credentials" });
      }
      //token/access for student if password is correct
      const token = jwt.sign(
        //
        {
          id: student._id,
          role: "student",
        },
        process.env.SECRET_KEY, //secret key from our dotenv file
        { expiresIn: "1h" } //expiration time
      );

      res.status(200).json({
        status: "success",
        data: {
          token,
          student: {
            _id: student._id,
            name: student.name,
            email: student.email,
          },
        },
        message: "Student logged in successfully",
      });
    } else {
      return res.status(400).json({ message: "Invalid account type" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async ({ body: { email } }, res) => {
  //checking if email exist in the database
  const student = await Student.findOne({ email });
  if (!student)
    return res
      .status(404)
      .json({ message: "email does not exist", status: "error" });
  //generate a random token(OTP) to reset password
  const generatedToken = crypto.randomBytes(3);
  if (!generatedToken) {
    return res.status(500).json({
      message: "an error occoured. please try again later.",
      status: "error",
    });
  }
  //converting the token into Hexstring
  const convertTokenToHexString = generatedToken.toString("hex");
  //assigning the converted string to the resetToken
  //setting the token and expiring period
  student.resetToken = convertTokenToHexString;
  student.expireToken = Date.now() + 1800000;
  //using the try&catch method to manage the process when saving the token and expired token duration to the client property in the database
  try {
    const saveToken = await student.save();
    return res.status(200).json({
      message: "add url that handles reset password",
      data: {
        resetToken: saveToken.resetToken, // Send the  token to the user
        expireToken: saveToken.expireToken,
        userId: saveToken._id, // Include the user ID in the response
      },
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `error trying to save token -> ${error}`,
    });
  }
};
//this function can be executed after using email to generate token from the previous function
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword, userId } = req.body; //these parameters would be required to change the password

  // Find the student with the provided user ID and check if the token has not expired
  const student = await Student.findOne({
    _id: userId,
    expireToken: { $gt: Date.now() },
  });

  if (!student) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }

  // Compare the provided token with the hashed token in the database
  const isValidToken = bcrypt.compare(resetToken, student.resetToken);
  if (!isValidToken) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  student.password = hashedPassword;

  // Remove the resetToken and expireToken fields from the database
  student.resetToken = undefined;
  student.expireToken = undefined;

  // Save the updated student data
  try {
    await student.save();
    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error resetting password -> ${error.message}`,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({
        status: "error",
        message: "Student not found",
      });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) {
      return res.status(400).send({
        status: "error",
        message: "Old password is incorrect",
      });
    }

    // Hash the new password
    student.password = await bcrypt.hash(newPassword, 10);

    // Save the updated student data
    await student.save();

    res.status(200).send({
      status: "success",
      message: "Password has been changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async ({ body: { email } }, res) => {
  //checking if email exist in the database
  const instructor = await Instructor.findOne({ email });
  if (!instructor)
    return res
      .status(404)
      .json({ message: "email does not exist", status: "error" });
  //generate a random token(OTP) to reset password
  const generatedToken = crypto.randomBytes(3);
  if (!generatedToken) {
    return res.status(500).json({
      message: "an error occoured. please try again later.",
      status: "error",
    });
  }
  //converting the token into Hexstring
  const convertTokenToHexString = generatedToken.toString("hex");
  //assigning the converted string to the resetToken
  //setting the token and expiring period
  instructor.resetToken = convertTokenToHexString;
  instructor.expireToken = Date.now() + 1800000; //expiration time of the generated token
  //using the try&catch method to manage the process when saving the token and expired token duration to the client property in the database
  try {
    const saveToken = await instructor.save();
    return res.status(200).json({
      message: "add url that handles reset password",
      data: {
        resetToken: saveToken.resetToken, // Send the  token to the user
        expireToken: saveToken.expireToken,
        userId: saveToken._id, // Include the user ID in the response
      },
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `error trying to save token -> ${error}`,
    });
  }
};
//this function can be executed after using email to generate token from the previous function
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword, userId } = req.body;

  // Find the student with the provided user ID and check if the token has not expired
  const instructor = await Instructor.findOne({
    _id: userId,
    expireToken: { $gt: Date.now() },
  });

  if (!instructor) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }

  // Compare the provided token with the hashed token in the database
  const isValidToken = bcrypt.compare(resetToken, instructor.resetToken);
  if (!isValidToken) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  instructor.password = hashedPassword;

  // Remove the resetToken and expireToken fields from the database
  instructor.resetToken = undefined;
  instructor.expireToken = undefined;

  // Save the updated student data
  try {
    await instructor.save();
    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error resetting password -> ${error.message}`,
    });
  }
};
//this function is for when the old password is known can be updated when logged in
//this is an update password for instructor
exports.changePassword = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { oldPassword, newPassword } = req.body; //oldpassword is needed because i didn't forget the old one

    // Find the student by ID the instructor id is needed to specify which of the insructor in the database
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).send({
        status: "error",
        message: "instructor not found",
      });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, instructor.password);
    if (!isMatch) {
      return res.status(400).send({
        status: "error",
        message: "Old password is incorrect",
      });
    }

    // Hashing the new password
    instructor.password = await bcrypt.hash(newPassword, 10);

    // Save the updated student data
    await instructor.save();

    res.status(200).send({
      status: "success",
      message: "Password has been changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
