// controllers/clearanceController.js
const Clearance = require("../models/Clearance");
const Student = require("../models/Student");
const Department = require("../models/Department");

// Initiate clearance
exports.initiateClearance = async (req, res) => {
  try {
    const { studentId, departmentId } = req.body;

    // Validate IDs
    if (!studentId || !mongoose.isValidObjectId(studentId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid studentId" });
    if (!departmentId || !mongoose.isValidObjectId(departmentId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid departmentId" });

    // Get student
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

    // Check existing clearance
    const existingClearance = await Clearance.findOne({
      student: student._id,
      department: departmentId,
    });
    if (existingClearance)
      return res
        .status(400)
        .json({ success: false, message: "Clearance already initiated" });

    // Map requirements
    const requirements =
      department.clearanceRequirements?.map((req) => ({
        requirement: req._id,
        status: "pending",
      })) || [];

    // Create clearance
    const clearance = await Clearance.create({
      student: student._id,
      department: departmentId,
      requirements,
    });
    student.clearanceStatus = "in_progress";
    await student.save();

    res.status(201).json({ success: true, data: clearance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve requirement
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
    await clearance.save();

    if (clearance.requirements.every((r) => r.status === "approved")) {
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

// Reject requirement
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
