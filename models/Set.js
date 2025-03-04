const mongoose = require('mongoose')

const Schema = mongoose.Schema

const setSchema = new Schema({
    session: {
        type: mongoose.Types.ObjectId,
        ref: "Session",
        required: true

    },

    name: {
        type: String,
        required: true

    },
    players: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
  

})

module.exports = mongoose.model('Set', setSchema)