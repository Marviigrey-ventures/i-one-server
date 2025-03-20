const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const matchSchema = new Schema({
  teamOne: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Set",
  },
  teamTwo: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Set",
  },
  teamOneScore: {
    type: Number,
    default: 0,
    required: true
   
  },
  teamTwoScore: {
    type: Number,
    default: 0,
    required: true
  },
  isStarted: {
    type: Boolean,
    default: false
  },
  session: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Session",
  },
});

module.exports = mongoose.model("Match", matchSchema);
