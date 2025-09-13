const express = require("express");
const {
  getStatistics,
  getClearanceReports,
  createUser,
  updateUser,
} = require("../controllers/adminController");

const router = express.Router();

// Get system statistics
router.route("/statistics").get(getStatistics);

// Get clearance reports
router.route("/clearance-reports").get(getClearanceReports);

// Create a new user
router.route("/users").post(createUser);

// Update an existing user
router.route("/users/:id").put(updateUser);

module.exports = router;
