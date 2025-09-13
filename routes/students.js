const express = require("express");
const {
  getStudents,
  getStudent,
  getStudentClearanceStatus,
  updateStudent,
} = require("../controllers/studentController");

const router = express.Router();

const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router
  .route("/")
  .get(protect, authorize("admin", "department_head", "staff"), getStudents);

router
  .route("/:id")
  .get(protect, getStudent)
  .put(protect, authorize("admin"), updateStudent);

router.route("/:id/clearance-status").get(protect, getStudentClearanceStatus);

module.exports = router;
