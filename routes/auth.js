const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get current logged-in user
router.get("/me", getMe);

module.exports = router;
