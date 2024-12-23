const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isCaptain: {
    type: Boolean,
    default: false,
  },
  currentSession: {
    type: mongoose.Types.ObjectId,
    default: null,
    ref: "Session"
  },
  otp: {
    type: Number,
    default: null,
  },
  otpExpiration: {
    type: Date,
    default: null,
  },
  otpVerified: {
    type: Boolean,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
