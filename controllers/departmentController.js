const Department = require("../models/Department");

// @desc Get all departments
// @route GET /api/departments
// @access Public
exports.getDepartments = async (req, res) => {
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

// @desc Get single department
// @route GET /api/departments/:id
// @access Public
exports.getDepartment = async (req, res) => {
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

// @desc Get department clearance requirements
// @route GET /api/departments/:id/clearance-requirements
// @access Public
exports.getDepartmentClearanceRequirements = async (req, res) => {
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

// @desc Update department clearance requirements
// @route PUT /api/departments/:id/clearance-requirements
// @access Private/Admin/DepartmentHead
exports.updateDepartmentClearanceRequirements = async (req, res) => {
  try {
    let department = await Department.findById(req.params.id);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });

    department.clearanceRequirements = req.body.requirements.map((req) => ({
      _id: req._id || new mongoose.Types.ObjectId(),
      name: req.name,
      description: req.description,
      required: req.required,
      approvingAuthority: req.approvingAuthority,
    }));

    await department.save();

    res
      .status(200)
      .json({ success: true, data: department.clearanceRequirements });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
