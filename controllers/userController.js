const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const crypto = require("crypto");
const sendMail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  const { email, nickname, password, isOwner, address, location, position } = req.body;

  if (!email || !password || !nickname || !address || !location || position)
    return res.status(400).json({ message: "all fields must be filled" });

  if (!isOWner)
    return res.status(400).json({ message: "Specify your role as a user" });

  


  const isEmail = validator.isEmail(email);
  if (!isEmail) return res.status(400).json({ message: "invalid Email" });

  const userEmailExists = await User.findOne({ email });
  if (userEmailExists)
    return res.status(409).json({ message: "email already in use" });

  const nicknameExists = await User.findOne({ nickname });

  if (nicknameExists)
    res.status(400).json({ message: "Nickname already in use" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await User.create({
      email,
      nickname,
      password: hashedPassword,
      isOwner,
      address,
      location,
      position
    });

    createToken(res, newUser._id);
    res.status(201).json({
      email: newUser.email,
      nickname: newUser.nickname,
      id: newUser._id,
      isAdmin: newUser.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Input email and password" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword)
    return res.status(404).json({ message: "Check email or password" });

  try {
    createToken(res, user._id);
    res.status(200).json({
      email: user.email,
      isAdmin: user.isAdmin,
      id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const logoutCurrentUser = async (req, res) => {
  console.log(req.user);
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "user logged out successfully" });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Input Email" });

    //get user based on email
    const user = await User.findOne({ email });
    if (!user)
      res.status(404).json({ message: "User not found with given mail" });

    //generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    //set OTP and expiration in database
    user.otp = otp;
    user.otpExpiration = Date.now() + 15 * 60 * 1000; //OTP valid for 15 minuites
    user.otpVerified = false;
    await user.save();

    //send OTP to mail
    await sendMail(
      email,
      "PASSWORD RESET OTP",
      `Your OTP for password reset is ${otp}. It is valid for 15 mins`
    );

    res.status(200).json({ message: `OTP sent to ${email}`, email });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiration < Date.now())
      return res.status(401).json({ message: "Invaid or expired OTP" });

    //mark otp as verified
    user.otpVerified = true;
    await user.save();

    res
      .status(200)
      .json({ message: "OTP verified, proceed to reset password", email });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otpVerified)
      return res.status(401).json({ message: "OTP not verified" });

    //check if passwords match
    if (newPassword !== confirmPassword)
      return res.status(401).json({ message: "Passwords do not match" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiration = null;
    user.otpVerified = false;
    await user.save();

    res.status(200).json({ message: "Password reset Successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const testsession = async (req, res) => {
  const user = await User.find({});

  res.status(200).json(user);
};

module.exports = {
  registerUser,
  authUser,
  logoutCurrentUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  testsession,
};
