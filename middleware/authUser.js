

const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
console.log("wagwan")

  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (!token)
    return res.status(401).json({ message: "No token, unauthorized" });
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not Authorised, token failed" });
  }
};


//authorizing owner

const authorizeOwner = (req, res, next) =>{
  if(req.user && req.user.isOwner){
    console.log("user is an owner")
    next()}else{
    res.status(401).json({ message: "Not an authorised owner" });
  }
}


module.exports = { authenticate, authorizeOwner };
