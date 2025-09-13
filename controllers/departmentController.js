const Department = require("../models/Department");

// @desc    Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate({
      path: "head",
      select: "name email",
    });
    res
      .status(200)
      .json({ success: true, count: departments.length, data: departments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single department
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate({
      path: "head",
      select: "name email",
    });
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get department clearance requirements
const getDepartmentClearanceRequirements = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    res
      .status(200)
      .json({ success: true, data: department.clearanceRequirements });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update department clearance requirements
const updateDepartmentClearanceRequirements = async (req, res) => {
  try {
    let department = await Department.findById(req.params.id);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });

    department = await Department.findByIdAndUpdate(
      req.params.id,
      { clearanceRequirements: req.body.requirements },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ success: true, data: department.clearanceRequirements });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  getDepartmentClearanceRequirements,
  updateDepartmentClearanceRequirements,
};
