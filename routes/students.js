const express = require("express");
const {
  getStudents,
  getStudent,
  getStudentClearanceStatus,
  updateStudent,
} = require("../controllers/studentController");

const router = express.Router();

// Get all students
router.get("/", getStudents);

// Get a single student by ID and update a student
router.route("/:id").get(getStudent).put(updateStudent);

// Get student clearance status
router.get("/:id/clearance-status", getStudentClearanceStatus);

module.exports = router;
