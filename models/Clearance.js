const mongoose = require("mongoose");

const ClearanceSchema = new mongoose.Schema(
  {
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
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "needs-docs"],
      default: "pending",
    },
    remarks: String,
    requiredDocs: [
      {
        name: String,
        uploaded: { type: Boolean, default: false },
        url: String,
      },
    ],
    clearedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clearance", ClearanceSchema);
