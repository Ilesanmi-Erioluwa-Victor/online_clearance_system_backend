const Student = require("../models/Student");

// @desc Get all students
// @route GET /api/students
// @access Private/Admin/Department
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate({ path: "user", select: "name email" })
      .populate("department", "name code");
    res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Get single student
// @route GET /api/students/:id
// @access Private
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate({ path: "user", select: "name email" })
      .populate("department", "name code");

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Update student
// @route PUT /api/students/:id
// @access Private/Admin
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
