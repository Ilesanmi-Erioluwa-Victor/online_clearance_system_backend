const express = require("express");
const router = express.Router();
const roleCtrl = require("../controllers/roleController");
const { protect, authorizeRoles } = require("../middleware/auth");

// Create role (admin only)
router.post("/", protect, authorizeRoles("admin"), roleCtrl.createRole);

// List roles (authenticated)
router.get("/", protect, roleCtrl.getRoles);

// Get role by id (authenticated)
router.get("/:id", protect, roleCtrl.getRoleById);

// Update role (admin only)
router.put("/:id", protect, authorizeRoles("admin"), roleCtrl.updateRole);

// Delete role (admin only)
router.delete("/:id", protect, authorizeRoles("admin"), roleCtrl.deleteRole);

module.exports = router;
