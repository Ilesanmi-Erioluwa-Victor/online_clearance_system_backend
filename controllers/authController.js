const User = require("../models/User");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 30;
  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        matricNumber: user.matricNumber,
      },
    });
};

// @desc    Register user
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      matricNumber,
      level,
      graduationYear,
    } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      matricNumber,
    });

    if (role === "student") {
      await Student.create({
        user: user._id,
        matricNumber,
        department,
        level,
        graduationYear,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get current logged in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("department");
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe };
