const express = require("express");
const router = express.Router();
const {
  createExamRecord,
  getExamRecords,
  getExamRecordById,
  updateExamRecord,
  deleteExamRecord,
} = require("../controllers/examController");
const { protect, authorizeRoles } = require("../middleware/auth");

// Only staff/admin can create and verify exam records
router.post("/", protect, authorizeRoles("admin", "staff"), createExamRecord);
router.get("/", protect, authorizeRoles("admin", "staff"), getExamRecords);
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "staff", "student"),
  getExamRecordById
);
router.put("/:id", protect, authorizeRoles("admin", "staff"), updateExamRecord);
router.delete("/:id", protect, authorizeRoles("admin"), deleteExamRecord);

module.exports = router;
