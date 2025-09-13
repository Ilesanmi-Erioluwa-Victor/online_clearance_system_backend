const User = require("../models/User");
const Student = require("../models/Student");
const Department = require("../models/Department");
const Clearance = require("../models/Clearance");

// @desc Get system statistics
// @route GET /api/admin/statistics
// @access Private/Admin
exports.getStatistics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalStaff = await User.countDocuments({ role: "staff" });
    const totalDepartments = await Department.countDocuments();
    const totalClearances = await Clearance.countDocuments();

    const completedClearances = await Clearance.countDocuments({
      status: "completed",
    });
    const pendingClearances = await Clearance.countDocuments({
      status: "in_progress",
    });
    const issueClearances = await Clearance.countDocuments({
      status: "pending_issues",
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalStaff,
        totalDepartments,
        totalClearances,
        completedClearances,
        pendingClearances,
        issueClearances,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Get clearance reports
// @route GET /api/admin/clearance-reports
// @access Private/Admin
exports.getClearanceReports = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.initiationDate = {};
      if (startDate) query.initiationDate.$gte = new Date(startDate);
      if (endDate) query.initiationDate.$lte = new Date(endDate);
    }
    if (department && department !== "all") query.department = department;

    const clearances = await Clearance.find(query)
      .populate({
        path: "student",
        populate: { path: "user", select: "name email" },
      })
      .populate("department")
      .populate("requirements.requirement")
      .populate("requirements.approvedBy", "name email");

    res
      .status(200)
      .json({ success: true, count: clearances.length, data: clearances });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Create user
// @route POST /api/admin/users
// @access Private/Admin
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      matricNumber,
      level,
      graduationYear,
    } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      matricNumber,
    });

    if (role === "student") {
      await Student.create({
        user: user._id,
        matricNumber,
        department,
        level,
        graduationYear,
      });
    }

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Update user
// @route PUT /api/admin/users/:id
// @access Private/Admin
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
