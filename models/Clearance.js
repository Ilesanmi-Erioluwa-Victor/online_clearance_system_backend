// models/Clearance.js
const mongoose = require("mongoose");

const requirementStatusSchema = new mongoose.Schema({
  requirement: { type: mongoose.Schema.Types.ObjectId, ref: "Requirement" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  comments: { type: String, maxlength: 500 },
  rejectionReasons: { type: String, maxlength: 500 },
});

const clearanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  initiationDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "pending_issues"],
    default: "not_started",
  },
  requirements: [requirementStatusSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Clearance", clearanceSchema);
