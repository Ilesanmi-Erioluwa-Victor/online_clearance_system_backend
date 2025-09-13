const Clearance = require("../models/Clearance");
const Student = require("../models/Student");
const Department = require("../models/Department");

exports.requestClearance = async (req, res) => {
  try {
    const { studentId, departmentId, requiredDocs } = req.body;

    const student = await Student.findById(studentId);
    const department = await Department.findById(departmentId);
    if (!student || !department)
      return res
        .status(404)
        .json({ message: "Student or Department not found" });

    const clearance = await Clearance.create({
      student: studentId,
      department: departmentId,
      submittedBy: req.user._id,
      requiredDocs,
    });

    res.status(201).json({ success: true, clearance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClearances = async (req, res) => {
  try {
    const clearances = await Clearance.find()
      .populate("student")
      .populate("department")
      .populate("submittedBy");
    res.json({ success: true, count: clearances.length, clearances });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClearanceById = async (req, res) => {
  try {
    const clearance = await Clearance.findById(req.params.id)
      .populate("student")
      .populate("department")
      .populate("submittedBy");
    if (!clearance)
      return res.status(404).json({ message: "Clearance not found" });
    res.json({ success: true, clearance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClearanceStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const clearance = await Clearance.findById(req.params.id);
    if (!clearance)
      return res.status(404).json({ message: "Clearance not found" });

    clearance.status = status;
    clearance.remarks = remarks || clearance.remarks;
    if (status === "approved") clearance.clearedAt = Date.now();

    await clearance.save();

    // mark student as cleared if all their departments are approved
    if (status === "approved") {
      const allClearances = await Clearance.find({
        student: clearance.student,
      });
      const allApproved = allClearances.every((c) => c.status === "approved");
      if (allApproved) {
        await Student.findByIdAndUpdate(clearance.student, { isCleared: true });
      }
    }

    res.json({ success: true, clearance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteClearance = async (req, res) => {
  try {
    const clearance = await Clearance.findByIdAndDelete(req.params.id);
    if (!clearance)
      return res.status(404).json({ message: "Clearance not found" });
    res.json({ success: true, message: "Clearance deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
