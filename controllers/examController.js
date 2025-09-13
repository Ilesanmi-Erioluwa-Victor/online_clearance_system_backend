const ExamRecord = require("../models/ExamRecord");
const Student = require("../models/Student");

exports.createExamRecord = async (req, res) => {
  try {
    const { studentId, session, semester, courses, gpa } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const record = await ExamRecord.create({
      student: studentId,
      session,
      semester,
      courses,
      gpa,
      verifiedBy: req.user._id,
      verifiedAt: Date.now(),
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExamRecords = async (req, res) => {
  try {
    const records = await ExamRecord.find()
      .populate("student")
      .populate("verifiedBy");
    res.json({ success: true, count: records.length, records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExamRecordById = async (req, res) => {
  try {
    const record = await ExamRecord.findById(req.params.id)
      .populate("student")
      .populate("verifiedBy");
    if (!record)
      return res.status(404).json({ message: "Exam record not found" });
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateExamRecord = async (req, res) => {
  try {
    const record = await ExamRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!record)
      return res.status(404).json({ message: "Exam record not found" });
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExamRecord = async (req, res) => {
  try {
    const record = await ExamRecord.findByIdAndDelete(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Exam record not found" });
    res.json({ success: true, message: "Exam record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
