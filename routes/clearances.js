const express = require("express");
const {
  initiateClearance,
  getClearance,
  approveRequirement,
  rejectRequirement,
  getStudentClearances,
  getDepartmentClearances,
} = require("../controllers/clearanceController");

const router = express.Router();

// Initiate clearance
router.route("/initiate").post(initiateClearance);

// Get a specific clearance by ID
router.route("/:clearanceId").get(getClearance);

// Approve a clearance requirement
router.route("/:clearanceId/approve").post(approveRequirement);

// Reject a clearance requirement
router.route("/:clearanceId/reject").post(rejectRequirement);

// Get all clearances for a student
router.route("/student/:studentId").get(getStudentClearances);

// Get all clearances for a department
router.route("/department/:departmentId").get(getDepartmentClearances);

module.exports = router;
