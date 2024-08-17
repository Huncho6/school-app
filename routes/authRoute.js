const { Router } = require("express");

const {
  createAccount,
  login,
  studentForgotPassword,
  instructorForgotPassword,
  studentResetPassword,
  instructorResetPassword,
  studentChangePassword,
  instructorChangePassword,
} = require("../controllers/authController");
const router = Router();
//:account in this function allows us to specify if the user is instructor or student when testing with postman since they're in the same function
router.post("/auth/create-account/:account", createAccount); // Create account function
router.post("/auth/login/:account", login); // Login function
//this is an alternative to using the :account this is used when they're in different functions
router.post("/auth/forgot-password/student", studentForgotPassword);
router.post("/auth/forgot-password/instructor", instructorForgotPassword); //forget password function
//reset password function can be carried out after getting a token from the forget password function
router.post("/auth/reset-password/student", studentResetPassword);
router.post("/auth/reset-password/instructor", instructorResetPassword);
//change password for when password is known more like updating the old one
router.put("/student/:studentId/change-password", studentChangePassword);
router.put(
  "/instructor/:instructorId/change-password",
  instructorChangePassword
);
module.exports = router;
