const express = require("express");
const {
  getDepartments,
  getDepartment,
  getDepartmentClearanceRequirements,
  updateDepartmentClearanceRequirements,
} = require("../controllers/departmentController");

const router = express.Router();

const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.route("/").get(getDepartments);

router.route("/:id").get(getDepartment);

router
  .route("/:id/clearance-requirements")
  .get(getDepartmentClearanceRequirements)
  .put(
    protect,
    authorize("admin", "department_head"),
    updateDepartmentClearanceRequirements
  );

module.exports = router;
