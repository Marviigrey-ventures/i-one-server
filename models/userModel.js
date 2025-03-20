const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  password: {
    type: String, 
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  locationInfo: {
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  position: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isOwner: {
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
    ref: "Session",
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
