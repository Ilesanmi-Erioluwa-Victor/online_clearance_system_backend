require("dotenv").config(); // Load your .env variables
const mongoose = require("mongoose");
const Student = require("./models/Student"); // adjust path if needed

async function test() {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`
    );

    // Try to find the student by ID
    const student = await Student.findById("68c56cd6f18d3b465b53a0aa");
    console.log("Student document:", student);

    // Close the connection
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error connecting to DB or finding student:", err);
  }
}

test();
