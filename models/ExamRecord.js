const mongoose = require("mongoose");

const ExamRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    session: String, // e.g. 2023/2024
    semester: String,
    courses: [{ code: String, title: String, score: Number, grade: String }],
    gpa: Number,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamRecord", ExamRecordSchema);
