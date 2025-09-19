const nodemailer = require("nodemailer");
require("dotenv").config();



const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  
});

const sendOtpEmail = async (toEmail, otp) => {
  console.log("Environment variables loaded");
  console.log("GMAIL_USER:", process.env.GMAIL_USER);

  const mailOptions = {
    from: `"My App Security" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: " Your OTP Code",
    text: `Your OTP code is ${otp}`, // fallback text
    html: `
      <div style="font-family: Arial, sans-serif; background: #f4f6f9; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: #4CAF50; padding: 15px; text-align: center; color: #fff;">
            <h2 style="margin: 0;">🔐Swwar OTP Verification</h2>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">Use the OTP below to complete your verification :</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; margin: 20px 0; color: #4CAF50;">${otp}</h1>
            <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes. Do not share it with anyone.</p>
          </div>
          <div style="background: #f4f6f9; padding: 10px; text-align: center; font-size: 12px; color: #888;">
            <p>If you didn’t request this, you can safely ignore this email.</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully");
    return { success: true }; 
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return { success: false, error };
  }
};

module.exports = { sendOtpEmail };
