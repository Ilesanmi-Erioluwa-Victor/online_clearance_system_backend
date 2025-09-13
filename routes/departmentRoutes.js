const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { protect, authorizeRoles } = require("../middleware/auth");

// Only admin can create/update/delete departments
router.post("/", protect, authorizeRoles("admin"), createDepartment);
router.get("/", protect, getDepartments);
router.get("/:id", protect, getDepartmentById);
router.put("/:id", protect, authorizeRoles("admin"), updateDepartment);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDepartment);

module.exports = router;
