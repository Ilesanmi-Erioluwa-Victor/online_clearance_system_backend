const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/auth");

// 👇 Admin/Staff only routes
router.get("/", protect, authorizeRoles("admin", "staff"), getUsers); // List all users
router.get("/:id", protect, authorizeRoles("admin", "staff"), getUserById); // Get single user
router.put("/:id", protect, authorizeRoles("admin", "staff"), updateUser); // Update user
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser); // Delete user (admin only)

module.exports = router;
