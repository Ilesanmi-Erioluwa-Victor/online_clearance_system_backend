const express = require("express");
const router = express.Router();
const {
  requestClearance,
  getClearances,
  getClearanceById,
  updateClearanceStatus,
  deleteClearance,
} = require("../controllers/clearanceController");
const { protect, authorizeRoles } = require("../middleware/auth");

// Student requests clearance
router.post("/", protect, authorizeRoles("student"), requestClearance);

// Staff/Admin can view and update
router.get("/", protect, authorizeRoles("admin", "staff"), getClearances);
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "staff", "student"),
  getClearanceById
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  updateClearanceStatus
);
router.delete("/:id", protect, authorizeRoles("admin"), deleteClearance);

module.exports = router;
