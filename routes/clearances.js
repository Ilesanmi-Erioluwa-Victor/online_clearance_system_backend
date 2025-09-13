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

// const { protect, authorize } = require("../middleware/auth");

router.route("/initiate").post("student", initiateClearance);

router.route("/:clearanceId").get(getClearance);

router
  .route("/:clearanceId/approve")
  .post(("admin", "department_head", "staff"), approveRequirement);

router
  .route("/:clearanceId/reject")
  .post(("admin", "department_head", "staff"), rejectRequirement);

router.route("/student/:studentId").get(getStudentClearances);

router
  .route("/department/:departmentId")
  .get(("admin", "department_head", "staff"), getDepartmentClearances);

module.exports = router;
