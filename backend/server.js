require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const EmployeeModel = require("./models/Employee");
const todoRoutes = require("./routes/todoRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const memberRoutes = require("./routes/memberRoutes");
const timesheetRoutes = require("./routes/timesheetRoutes");


const app = express();

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Change this to your frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(cookieParser());

// ✅ Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ✅ JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || ac53d90a08cd7ca18d63dd284a0c6f81a03808c69fd1054889314220e9d1d966;

// 🟢 **User Registration Route (Signup)**
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    // ✅ Store plain text password (Not Recommended for security)
    const newUser = new EmployeeModel({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
});


// 🟢 **User Login Route (JWT in HTTP-only Cookie)**
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Stored Password in DB:", user.password);
    console.log("Entered Password:", password);

    // ✅ Directly compare the password (No Hashing)
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    console.log('tokennnnnnn',token);
    
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });


    const cookies = res.cookie("token", token, {
      httpOnly: true, secure: true, sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // console.log('cookies',cookies);
    

    res.json({ message: "Login successful", user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// 🔹 **Check Authentication (Persistent Login)**
app.get("/check-auth", (req, res) => {
  const token = req.cookies.token; // ✅ Read JWT from HTTP-only cookie
  if (!token) return res.json({ isAuthenticated: false });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ isAuthenticated: false });

    res.json({ isAuthenticated: true, userId: decoded.id });
  });
});

// 🔴 **Logout Route (Clear Cookie)**
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict"
  });
  res.status(200).json({ message: "Logged out successfully", success: true }); // ✅ Success response
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// ✅ 🟢 **Todo Routes (Task Management)**
app.use("/api/todos", authMiddleware, todoRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", authMiddleware,projectRoutes);
app.use("/api/members", memberRoutes);
// app.use("/api/members/roles", memberRoutes);
app.use("/api/timesheets", authMiddleware, timesheetRoutes);


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
