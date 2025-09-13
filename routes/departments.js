const express = require("express");
const {
  getDepartments,
  getDepartment,
  getDepartmentClearanceRequirements,
  updateDepartmentClearanceRequirements,
} = require("../controllers/departmentController");

const router = express.Router();

// const { protect, authorize } = require("../middleware/auth");

router.route("/").get(getDepartments);

router.route("/:id").get(getDepartment);

router
  .route("/:id/clearance-requirements")
  .get(getDepartmentClearanceRequirements)
  .put(("admin", "department_head"), updateDepartmentClearanceRequirements);

module.exports = router;
