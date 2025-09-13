const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    clearanceRequirements: [
      {
        name: String,
        description: String,
        required: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
