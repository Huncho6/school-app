const Instructor = require("../models/instructorModel"); //importing instructor schema
const Student = require("../models/studentModel"); //importing student schema
const nodemailer = require("nodemailer"); //importing nodemailer to get email when account is created
const crypto = require("crypto"); //crypto is a random token generator that help to generate otp for for the forget password function
const bcrypt = require("bcrypt"); //importing bcrypt after installation
const jwt = require("jsonwebtoken"); //importing jsonwebtoken
const dotenv = require("dotenv"); //importing dotenv
dotenv.config();
//function to create account
const tempUserStore = new Map(); // Temporary store for confirmation codes

exports.createAccount = async (req, res) => {
  try {
    const { account } = req.params;
    const { email, password } = req.body;

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    let userModel, userType;

    // Determine the type of user account
    if (account === "student") {
      userModel = Student;
      userType = "student";
    } else if (account === "instructor") {
      userModel = Instructor;
      userType = "instructor";
    } else {
      return res.status(400).json({ message: "Invalid account type" });
    }

    // Check if user already exists
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    // Create the new user and save to database
    const newUser = new userModel(req.body);
    await newUser.save();

    // Generate a confirmation code
    const confirmationCode = crypto.randomBytes(3).toString("hex");
    tempUserStore.set(email, { ...req.body, confirmationCode });

    // Send confirmation email
    await sendConfirmationEmail(email, confirmationCode);

    return res.status(201).json({
      status: "success",
      message: `${userType} created successfully. Please check your email for the confirmation code.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to send confirmation emails
const sendConfirmationEmail = async (email, confirmationCode) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "abodunriniyanda1@gmail.com",
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Account Confirmation",
    text: `Your confirmation code is: ${confirmationCode}`,
  };

  return transporter.sendMail(mailOptions);
};
exports.verifyAccount = async (req, res) => {
  try {
    const { account } = req.params; // "student" or "instructor"
    const { confirmationCode, email } = req.body; // Include email in the body

    // Ensure email and confirmationCode are provided
    if (!email || !confirmationCode) {
      return res
        .status(400)
        .json({ message: "Email and confirmation code are required." });
    }

    // Retrieve user data from temporary storage
    const storedUser = tempUserStore.get(email);
    if (!storedUser || storedUser.confirmationCode !== confirmationCode) {
      return res
        .status(400)
        .json({ message: "Invalid confirmation code or email." });
    }

    // Determine the correct user model based on the account type
    let userModel;
    if (account === "student") {
      userModel = Student;
    } else if (account === "instructor") {
      userModel = Instructor;
    } else {
      return res.status(400).json({ message: "Invalid account type." });
    }

    // Save the user to the database with the correct model
    const newUser = new userModel({
      ...storedUser,
      confirmationCode: null,
    });
    await newUser.save();

    // Remove user data from temporary storage after saving to the database
    tempUserStore.delete(email);

    // Send congratulatory email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "abodunriniyanda1@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Account Verified",
      text: "Congratulations! Your account has been successfully created and verified.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email", error });
      } else {
        return res.status(200).json({
          status: "success",
          message:
            "Account verified successfully. A congratulatory email has been sent.",
        });
      }
    });
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

exports.studentForgotPassword = async ({ body: { email } }, res) => {
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

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "abodunriniyanda1@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    // Set up mail options
    const mailOptions = {
      from: "abodunriniyanda1@gmail.com",
      to: student.email,
      subject: "Hello from Nodemailer",
      text: `this is your reset token ${convertTokenToHexString} .`,
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          status: false,
          message: `error sending email -> ${error}`,
        });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          message: "Password reset token has been sent to your email.",
          data: {
            resetToken: saveToken.resetToken, // Send the token to the user
            expireToken: saveToken.expireToken,
          },
          status: "success",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `error trying to save token -> ${error}`,
    });
  }
};
//this function can be executed after using email to generate token from the previous function
exports.studentResetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body; //these parameters would be required to change the password

  // Find the student with the provided user ID and check if the token has not expired
  const student = await Student.findOne({
    expireToken: { $gt: Date.now() },
  });

  if (!student) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }

  // Compare the provided token with the hashed token in the database
  const isValidToken = await bcrypt.compare(resetToken, student.resetToken);
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

exports.studentChangePassword = async (req, res) => {
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

exports.instructorForgotPassword = async ({ body: { email } }, res) => {
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
exports.instructorResetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Find the student with the provided user ID and check if the token has not expired
  const instructor = await Instructor.findOne({
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
exports.instructorChangePassword = async (req, res) => {
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
