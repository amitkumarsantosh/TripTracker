const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const { sendOtpEmail } = require('../utils/googleMailClient');
const redis = require('../utils/upstash_otp_store');
const User = require('../models/User');
require('dotenv').config();



const sendOtp = async(req, res)=>{
    const { email } = req.body;

    try {
    // 1️⃣ Generate & store OTP in Redis
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redisResult = await redis.set(`otp:${email}`, otp, { ex: 300 });

    if (redisResult !== "OK") {
      return res.status(500).json({ error: "Failed to store OTP in Redis" });
    }

    // 2️⃣ Send Email
    const result = await sendOtpEmail(email, otp);
    if (!result.success) {
      await redis.del(`otp:${email}`);
      return res.status(500).json({ message: "Error sending OTP" });
    }

    res.status(200).json({status:"success", message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in sendOtp:", err);
    res.status(500).json({ status: "error", error: "Unexpected error while sending OTP" });
  }
}


const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ OTP is valid
    await redis.del(`otp:${email}`);

    // Create JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "supersecret", {
      expiresIn: "30d",
    });

    res.status(200).json({ token, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    res.status(500).json({ error: "Unexpected error while verifying OTP" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const signin = async (req, res) => {
    const {username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({ username, email, password });
    try {
      await newUser.save();
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});

      res.status(201).json({ message: "User created successfully", user: newUser, token });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: "Email already in use" });
      }
      res.status(500).json({ error: err.message });
    }

}

const searchUsername = async (req, res) => {
  const { username } = req.query; // ✅ query string
  const given_username = username
  console.log("Searching username:", given_username);

  try {
    const user = await User.findOne({ username: given_username });

    // If no user found → username is available (true)
    res.json(!user);
  } catch (err) {
    console.error(err);
    res.status(500).json(false);
  }
};

    
module.exports = { sendOtp, verifyOtp, login, signin, searchUsername };