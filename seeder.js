const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Department = require("./models/Department");

dotenv.config();

// Replace this with your MongoDB URI
const DB_URI = `${process.env.MONGODB_URI}`;

const departments = [
  {
    name: "Computer Science",
    code: "CS",
    clearanceRequirements: [
      {
        name: "Submit Project Report",
        description: "Submit final year project report to department",
        required: true,
        approvingAuthority: "department",
      },
      {
        name: "Pay Departmental Dues",
        description: "Clear all pending dues with the department",
        required: true,
        approvingAuthority: "bursary",
      },
    ],
  },
  {
    name: "Electrical Engineering",
    code: "EE",
    clearanceRequirements: [
      {
        name: "Lab Equipment Return",
        description: "Return all borrowed lab equipment",
        required: true,
        approvingAuthority: "department",
      },
      {
        name: "Pay Library Fines",
        description: "Clear any outstanding library fines",
        required: true,
        approvingAuthority: "library",
      },
    ],
  },
  {
    name: "Mechanical Engineering",
    code: "ME",
    clearanceRequirements: [
      {
        name: "Submit Workshop Report",
        description: "Submit final workshop report to department",
        required: true,
        approvingAuthority: "department",
      },
    ],
  },
  {
    name: "Business Administration",
    code: "BA",
    clearanceRequirements: [
      {
        name: "Clear Exam Fees",
        description: "Ensure all exam fees are paid",
        required: true,
        approvingAuthority: "exams",
      },
    ],
  },
];

const seedDepartments = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("MongoDB connected...");

    // Remove existing departments
    await Department.deleteMany();
    console.log("Existing departments removed");

    // Insert seed data
    await Department.insertMany(departments);
    console.log("Departments seeded successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDepartments();
