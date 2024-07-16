const { Router } = require("express")

const  { createAccount } = require("../controllers/authController");

const router = Router();

router.post("/auth/create-account/:account", createAccount);

module.exports = router;