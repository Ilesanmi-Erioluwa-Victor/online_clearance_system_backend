const Student = require("../models/Student");
const User = require("../models/User");

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Department
const getStudents = async (req, res) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    let query = Student.find(JSON.parse(queryStr)).populate([
      { path: "user", select: "name email" },
      { path: "department", select: "name code" },
    ]);

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Student.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);
    const students = await query;

    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({
      success: true,
      count: students.length,
      pagination,
      data: students,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate([
      { path: "user", select: "name email" },
      { path: "department", select: "name code" },
    ]);

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get student clearance status
// @route   GET /api/students/:id/clearance-status
// @access  Private
const getStudentClearanceStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    res.status(200).json({
      success: true,
      data: { clearanceStatus: student.clearanceStatus },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
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

// Export all controller functions
module.exports = {
  getStudents,
  getStudent,
  getStudentClearanceStatus,
  updateStudent,
};
