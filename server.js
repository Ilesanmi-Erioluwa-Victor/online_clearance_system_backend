const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require("./routes/auth");
const students = require("./routes/students");
const departments = require("./routes/departments");
const clearances = require("./routes/clearance");
const admin = require("./routes/admin");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "*", // your frontend domain
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Mount routers
app.use("/api/auth", auth);
app.use("/api/students", students);
app.use("/api/departments", departments);
app.use("/api/clearance", clearances);
app.use("/api/admin", admin);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
