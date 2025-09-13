const express = require("express");
const {
  getStatistics,
  getClearanceReports,
  createUser,
  updateUser,
} = require("../controllers/adminController");

const router = express.Router();

// const { protect, authorize } = require("../middleware/auth");

router.route("/statistics").get("admin", getStatistics);

router.route("/clearance-reports").get("admin", getClearanceReports);

router.route("/users").post("admin", createUser);

router.route("/users/:id").put("admin", updateUser);

module.exports = router;
