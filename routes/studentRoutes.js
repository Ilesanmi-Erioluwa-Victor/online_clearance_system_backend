const express = require("express");
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentProfileById,
  getStudentProfile,
} = require("../controllers/studentController");
const { protect, authorizeRoles } = require("../middleware/auth");

// Only admin or staff can manage students
router.post("/", protect, authorizeRoles("admin", "staff"), createStudent);
router.get("/", protect, authorizeRoles("admin", "staff"), getStudents);
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "staff", "student"),
  getStudentById
);
router.put("/:id", protect, authorizeRoles("admin", "staff"), updateStudent);
router.delete("/:id", protect, authorizeRoles("admin"), deleteStudent);

router.get("/profile", protect, getStudentProfile); // self-profile
router.get("/:studentId/profile", protect, getStudentProfileById);

module.exports = router;
