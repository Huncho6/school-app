const { Router } = require("express");

const {
  createAccount,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const router = Router();
//:account in this function allows us to specify if the user is instructor or student when testing with postman
router.post("/auth/create-account/:account", createAccount); // Create account function
router.post("/auth/login/:account", login); // Login function
router.post("/auth/forgot-password/:account", forgotPassword); //forget password function
router.post("/auth/reset-password/:account", resetPassword); //reset password function can be carried out after getting a token from the forget password function
//this is an alternative to using the :account
router.put("/student/:studentId/change-password", changePassword);
router.put("/instructor/:instructorId/change-password", changePassword);
module.exports = router;
