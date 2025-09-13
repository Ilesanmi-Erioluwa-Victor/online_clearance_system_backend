const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: true,
  },
  approvingAuthority: {
    type: String,
    enum: ["department", "library", "bursary", "exams"],
    required: true,
  },
});

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a department name"],
    unique: true,
    trim: true,
    maxlength: [100, "Department name cannot be more than 100 characters"],
  },
  code: {
    type: String,
    required: [true, "Please add a department code"],
    unique: true,
    uppercase: true,
    maxlength: [10, "Department code cannot be more than 10 characters"],
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  clearanceRequirements: [requirementSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
