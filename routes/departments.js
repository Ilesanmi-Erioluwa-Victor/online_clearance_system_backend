const express = require("express");
const {
  getDepartments,
  getDepartment,
  getDepartmentClearanceRequirements,
  updateDepartmentClearanceRequirements,
} = require("../controllers/departmentController");

const router = express.Router();

// Get all departments
router.route("/").get(getDepartments);

// Get a single department by ID
router.route("/:id").get(getDepartment);

// Get or update department clearance requirements
router
  .route("/:id/clearance-requirements")
  .get(getDepartmentClearanceRequirements)
  .put(updateDepartmentClearanceRequirements);

module.exports = router;
