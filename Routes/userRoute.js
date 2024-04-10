const express = require("express");
const { registerUser, loginUser, resendRegistrationEmail, verifyEmail } = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/resend-email', resendRegistrationEmail);

module.exports = router;