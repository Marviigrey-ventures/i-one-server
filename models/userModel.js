const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false
    },
   otp: {
    type: String,
    default: null
   },
   otpExpiration: {
    type: Date,
    default: null
   },
   otpVerified: {
    type: Boolean,
    default: null
   }
},)

module.exports = mongoose.model('User', userSchema)