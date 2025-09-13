const mongoose = require("mongoose");

const RequirementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Requirement", RequirementSchema);
