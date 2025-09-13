const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  matricNumber: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ["ND I", "ND II", "HND I", "HND II"],
  },
  graduationYear: {
    type: Number,
    required: true,
  },
  clearanceStatus: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "pending_issues"],
    default: "not_started",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
