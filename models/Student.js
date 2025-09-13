const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    matricNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    programme: String,
    level: String,
    phone: String,
    userAccount: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional link
    isCleared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
