const express = require("express");
const {
  initiateClearance,
  getClearance,
  approveRequirement,
  rejectRequirement,
  getStudentClearances,
} = require("../controllers/clearanceController");

const router = express.Router();

// // Protect middleware (if you have one)
// const { protect } = require("../middleware/auth");

// Routes
router.post("/initiate", initiateClearance);
router.get("/:clearanceId", getClearance);
router.post("/:clearanceId/approve", approveRequirement);
router.post("/:clearanceId/reject", rejectRequirement);

// Get student clearances
router.get("/student/:studentId", getStudentClearances);

module.exports = router;
