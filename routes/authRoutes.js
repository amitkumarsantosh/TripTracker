const express= require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const redis = require('../utils/upstash_otp_store');
require('dotenv').config();
const { sendOtp, verifyOtp, signin, login, searchUsername } = require('../controllers/authControllers');
const { validateEmail } = require('../validators/emailValidators');

// Route to send OTP
router.post('/send-otp', sendOtp);
// Route to verify OTP
router.post('/verify-otp', validateEmail, verifyOtp);

router.post('/register', validateEmail, signin);
router.post('/login', validateEmail, login);


// routes/auth.js
router.get("/user-availability", searchUsername);

module.exports = router;