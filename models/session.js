const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  location: {
    type: String,
    required: true,
  },
  playersPerTeam: {
    type: Number,
    default: 0,
  },
  setNumber: {
    type: Number,
    default: 0,
  },
  minsPerSet: {
    type: Number,
    default: 0,
  },
  timeDuration: {
    type: Number,
    default: 0,
  },
  startTime: {
    type: Date,
    default: null,
  },
  stopTime: {
    type: Date,
    default: null
  },
  winningDecider: {
    type: String,
    default: null,
  },
  inProgress: {
    type: Boolean,
    default: false,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  captain: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
 maxNumber: {
  type: Number,
  default: 0
 },
  isFull: {
    type: Boolean,
    default: false,
  },
});



module.exports = mongoose.model("Session", sessionSchema);
