require('dotenv').config(); 
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ Connection error:", err.message);
  
  }
}

module.exports = connectDB;
