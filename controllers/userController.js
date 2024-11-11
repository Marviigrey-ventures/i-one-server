const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "all fields must be filled" });

  const isEmail = validator.isEmail(email);
  if (!isEmail) return res.status(400).json({ message: "invalid Email" });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(409).json({ message: "email already in use" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    createToken(res, newUser._id);
    res.status(201).json({
      email: newUser.email,
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
    res.json({
        email: user.email,
        isAdmin: user.isAdmin,
        id: user._id
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const logoutCurrentUser = async (req, res) => {
    console.log(req.user)
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({message: "user logged out successfully"})
  };

module.exports = {
  registerUser,
  authUser,
  logoutCurrentUser
};
