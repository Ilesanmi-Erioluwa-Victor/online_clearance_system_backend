const express = require("express");
const {
  getStatistics,
  getClearanceReports,
  createUser,
  updateUser,
} = require("../controllers/adminController");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/statistics").get(protect, authorize("admin"), getStatistics);

router
  .route("/clearance-reports")
  .get(protect, authorize("admin"), getClearanceReports);

router.route("/users").post(protect, authorize("admin"), createUser);

router.route("/users/:id").put(protect, authorize("admin"), updateUser);

module.exports = router;
