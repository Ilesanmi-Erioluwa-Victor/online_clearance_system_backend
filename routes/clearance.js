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

const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router
  .route("/initiate")
  .post(protect, authorize("student"), initiateClearance);

router.route("/:clearanceId").get(protect, getClearance);

router
  .route("/:clearanceId/approve")
  .post(
    protect,
    authorize("admin", "department_head", "staff"),
    approveRequirement
  );

router
  .route("/:clearanceId/reject")
  .post(
    protect,
    authorize("admin", "department_head", "staff"),
    rejectRequirement
  );

router.route("/student/:studentId").get(protect, getStudentClearances);

router
  .route("/department/:departmentId")
  .get(
    protect,
    authorize("admin", "department_head", "staff"),
    getDepartmentClearances
  );

module.exports = router;
