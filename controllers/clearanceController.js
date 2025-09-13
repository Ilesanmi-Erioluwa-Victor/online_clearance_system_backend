const Clearance = require("../models/Clearance");
const Student = require("../models/Student");
const Department = require("../models/Department");
const mongoose = require("mongoose");

// @desc    Initiate clearance process
// @route   POST /api/clearance/initiate
// @access  Private/Student
exports.initiateClearance = async (req, res, next) => {
  try {
    const { studentId, departmentId } = req.body;

    console.log("Incoming request body:", req.body);

    // Validate IDs
    if (!studentId || studentId.length !== 24) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid studentId" });
    }
    if (!departmentId || departmentId.length !== 24) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid departmentId" });
    }

    // Find student by user ID
    const student = await Student.findOne({ user: studentId });
    if (!student) {
      console.log("Student not found for user ID:", studentId);
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Find department
    const department = await Department.findById(departmentId);
    if (!department) {
      console.log("Department not found for ID:", departmentId);
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    // Check if clearance already exists
    const existingClearance = await Clearance.findOne({
      student: student._id,
      department: departmentId,
    });
    if (existingClearance) {
      return res.status(400).json({
        success: false,
        message: "Clearance process already initiated for this student",
      });
    }

    // Prepare clearance requirements
    const requirements =
      department.clearanceRequirements?.map((req) => ({
        requirement: req._id,
        status: "pending",
      })) || [];

    // Create new clearance
    const clearance = await Clearance.create({
      student: student._id,
      department: departmentId,
      requirements,
    });

    // Update student clearance status
    await Student.findByIdAndUpdate(student._id, {
      clearanceStatus: "in_progress",
    });

    console.log("Clearance initiated successfully:", clearance._id);
    res.status(201).json({ success: true, data: clearance });
  } catch (err) {
    console.error("Error initiating clearance:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get clearance details
// @route   GET /api/clearance/:clearanceId
// @access  Private
exports.getClearance = async (req, res, next) => {
  try {
    const clearance = await Clearance.findById(req.params.clearanceId)
      .populate("student")
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

// @desc    Approve clearance requirement
// @route   POST /api/clearance/:clearanceId/approve
// @access  Private/Staff/Admin/DepartmentHead
exports.approveRequirement = async (req, res, next) => {
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
    await clearance.save();

    const allApproved = clearance.requirements.every(
      (req) => req.status === "approved"
    );
    if (allApproved) {
      clearance.status = "completed";
      clearance.completionDate = Date.now();
      await clearance.save();

      await Student.findByIdAndUpdate(clearance.student, {
        clearanceStatus: "completed",
      });
    }

    res.status(200).json({ success: true, data: clearance });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Reject clearance requirement
// @route   POST /api/clearance/:clearanceId/reject
// @access  Private/Staff/Admin/DepartmentHead
exports.rejectRequirement = async (req, res, next) => {
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

// @desc    Get all clearance records for a student
// @route   GET /api/clearance/student/:studentId
// @access  Private
exports.getStudentClearances = async (req, res, next) => {
  try {
    // studentId here refers to User ID
    const student = await Student.findOne({ user: req.params.studentId });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    const clearances = await Clearance.find({ student: student._id })
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

// @desc    Get clearance records for a department
// @route   GET /api/clearance/department/:departmentId
// @access  Private/Department
exports.getDepartmentClearances = async (req, res, next) => {
  try {
    const clearances = await Clearance.find({
      department: req.params.departmentId,
    })
      .populate("student")
      .populate("requirements.requirement")
      .populate("requirements.approvedBy", "name email");

    res
      .status(200)
      .json({ success: true, count: clearances.length, data: clearances });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
