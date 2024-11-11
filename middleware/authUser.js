const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/userModel')

const authenticate = async (req, res, next) =>{
let token

// Read JWT from the 'jwt' cookie
     token = req.cookies.jwt

    if(!token) return res.status(401).json({message: "No token, unauthorized"})
    try{
        const decoded = await  jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.userId).select("-password")
       next()

    }catch(err){
        res.status(401).json({ message: "Not Authorised, token failed" });
    }


}



module.exports = {authenticate}