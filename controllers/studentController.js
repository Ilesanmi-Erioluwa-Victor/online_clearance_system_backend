const Student = require("../models/Student");
const Department = require("../models/Department");

exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("department");
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "department"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    if (req.user.role.name !== "student") {
      return res.status(403).json({ message: "Access denied: Students only" });
    }

    const student = await User.findById(req.user._id)
      .select("-password")
      .populate("role")
      .populate("department");

    if (!student) return res.status(404).json({ message: "Student not found" });

    const clearances = await Clearance.find({ student: req.user._id })
      .populate("department", "name code")
      .populate("staff", "name email");

    const examRecords = await ExamRecord.find({
      student: req.user._id,
    }).populate("department", "name code");

    res.json({
      success: true,
      student,
      clearanceRecords: clearances,
      examRecords,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin/Staff: Get ANY student profile by ID
exports.getStudentProfileById = async (req, res) => {
  try {
    // Only admin or staff can access
    if (!["admin", "staff"].includes(req.user.role.name)) {
      return res
        .status(403)
        .json({ message: "Access denied: Admin/Staff only" });
    }

    const { studentId } = req.params;

    const student = await User.findById(studentId)
      .select("-password")
      .populate("role")
      .populate("department");

    if (!student || student.role.name !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const clearances = await Clearance.find({ student: student._id })
      .populate("department", "name code")
      .populate("staff", "name email");

    const examRecords = await ExamRecord.find({
      student: student._id,
    }).populate("department", "name code");

    res.json({
      success: true,
      student,
      clearanceRecords: clearances,
      examRecords,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
