const express = require("express");
const {
  getStudents,
  getStudent,
  getStudentClearanceStatus,
} = require("../controllers/studentController");

const router = express.Router();

// Get all students
router.route("/").get(getStudents);

// Get a single student by ID and update a student
router.route("/:id").get(getStudent).put(updateStudent);

// Get student clearance status
router.route("/:id/clearance-status").get(getStudentClearanceStatus);

module.exports = router;
