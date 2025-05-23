const jwt = require('jsonwebtoken')
require('dotenv').config()


const createToken = (res, userId) =>{
const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: '30d',
})
  //set JWT as HTTP-only cookie
res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});


  return token
}

module.exports = createToken
