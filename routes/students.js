const express = require("express");
const {
  getStudents,
  getStudent,
  getStudentClearanceStatus,
  updateStudent,
} = require("../controllers/studentController");

const router = express.Router();

// const { protect, authorize } = require("../middleware/auth");

router.route("/").get(("admin", "department_head", "staff"), getStudents);

router.route("/:id").get(getStudent).put("admin", updateStudent);

router.route("/:id/clearance-status").get(getStudentClearanceStatus);

module.exports = router;
