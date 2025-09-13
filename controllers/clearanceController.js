const Clearance = require("../models/Clearance");
const Student = require("../models/Student");
const Department = require("../models/Department");
const mongoose = require("mongoose");

// @desc Initiate clearance process
// @route POST /api/clearance/initiate
// @access Private/Student
exports.initiateClearance = async (req, res) => {
  try {
    const { studentId, departmentId } = req.body;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid studentId" });

    if (!departmentId || !mongoose.Types.ObjectId.isValid(departmentId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid departmentId" });

    const student = await Student.findOne({ user: studentId });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    const department = await Department.findById(departmentId);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });

    const existingClearance = await Clearance.findOne({
      student: student._id,
      department: departmentId,
    });
    if (existingClearance)
      return res
        .status(400)
        .json({ success: false, message: "Clearance already initiated" });

    const requirements =
      department.clearanceRequirements?.map((req) => ({
        requirement: req._id,
        status: "pending",
      })) || [];

    const clearance = await Clearance.create({
      student: student._id,
      department: departmentId,
      requirements,
    });

    await Student.findByIdAndUpdate(student._id, {
      clearanceStatus: "in_progress",
    });

    res.status(201).json({ success: true, data: clearance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get clearance details
// @route GET /api/clearance/:clearanceId
// @access Private
exports.getClearance = async (req, res) => {
  try {
    const clearance = await Clearance.findById(req.params.clearanceId)
      .populate({
        path: "student",
        populate: { path: "user", select: "name email" },
      })
      .populate("department")
      .populate("requirements.requirement")
      .populate("requirements.approvedBy", "name email");

    if (!clearance)
      return res
        .status(404)
        .json({ success: false, message: "Clearance not found" });

    res.status(200).json({ success: true, data: clearance });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Approve a requirement
// @route POST /api/clearance/:clearanceId/approve
// @access Private/Staff/Admin/DepartmentHead
exports.approveRequirement = async (req, res) => {
  try {
    const { requirementId, comments } = req.body;
    const clearance = await Clearance.findById(req.params.clearanceId);
    if (!clearance)
      return res
        .status(404)
        .json({ success: false, message: "Clearance not found" });

    const requirement = clearance.requirements.id(requirementId);
    if (!requirement)
      return res
        .status(404)
        .json({ success: false, message: "Requirement not found" });

    requirement.status = "approved";
    requirement.approvedBy = req.user.id;
    requirement.approvedAt = Date.now();
    requirement.comments = comments;

    if (clearance.requirements.every((r) => r.status === "approved")) {
      clearance.status = "completed";
      clearance.completionDate = Date.now();
      await Student.findByIdAndUpdate(clearance.student, {
        clearanceStatus: "completed",
      });
    }

    await clearance.save();
    res.status(200).json({ success: true, data: clearance });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Reject a requirement
// @route POST /api/clearance/:clearanceId/reject
// @access Private/Staff/Admin/DepartmentHead
exports.rejectRequirement = async (req, res) => {
  try {
    const { requirementId, comments, reasons } = req.body;
    const clearance = await Clearance.findById(req.params.clearanceId);
    if (!clearance)
      return res
        .status(404)
        .json({ success: false, message: "Clearance not found" });

    const requirement = clearance.requirements.id(requirementId);
    if (!requirement)
      return res
        .status(404)
        .json({ success: false, message: "Requirement not found" });

    requirement.status = "rejected";
    requirement.comments = comments;
    requirement.rejectionReasons = reasons;

    clearance.status = "pending_issues";
    await clearance.save();
    await Student.findByIdAndUpdate(clearance.student, {
      clearanceStatus: "pending_issues",
    });

    res.status(200).json({ success: true, data: clearance });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
