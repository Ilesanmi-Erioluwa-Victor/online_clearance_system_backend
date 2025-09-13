const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/database");
const Role = require("../models/Role");
const Department = require("../models/Department");
const User = require("../models/User");

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing
    await Role.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();

    // Roles
    const roles = await Role.insertMany([
      { name: "admin", description: "System Administrator" },
      { name: "staff", description: "Department or Exam staff" },
      { name: "student", description: "Student user" },
    ]);

    console.log("✅ Roles seeded");

    // Departments
    const departments = await Department.insertMany([
      { code: "CS", name: "Computer Science" },
      { code: "EE", name: "Electrical Engineering" },
      { code: "BA", name: "Business Administration" },
    ]);

    console.log("✅ Departments seeded");

    // Create Admin user
    const adminRole = roles.find((r) => r.name === "admin");
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "admin123", // will be hashed in User model pre-save
      role: adminRole._id,
    });

    console.log("✅ Admin user seeded:", admin.email);

    console.log("🎉 Database seeding completed");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    process.exit(1);
  }
};

seedData();
