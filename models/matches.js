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
  session: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Session",
  },
});

module.exports = mongoose.model("Match", matchSchema);
