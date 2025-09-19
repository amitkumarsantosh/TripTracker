const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema(
  {
    // MongoDB will auto-generate _id (ObjectId)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      default: "",
    },
    age_group: {
      type: Number,
      default: 0, // can be mapped like 1=teen, 2=adult, etc.
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    income_bracket: {
      type: String,
      default: "unknown",
    },
    occupation: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "en",
    },
    badges: {
      type: [String],
      default: [],
    },
    preferred_modes: {
      type: [String],
      default: [],
    },
    privacy_level: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notifications_enabled: {
      type: Boolean,
      default: true,
    },
    is_anonymous: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 0,
    },
    streak_days: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  
);

// Index for faster search
userSchema.index({ email: 1, username: 1 });

module.exports = mongoose.model("User", userSchema);

