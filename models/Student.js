const mongoose = require("mongoose");
const Requirement = require("./Requirement"); // Ensure the model is imported to register the schema

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to user
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  matricNumber: { type: String, required: true, unique: true },
  clearanceStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  requirements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Requirement" }], // Reference to requirements
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", studentSchema);
