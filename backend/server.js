import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import HabitCompletionRoutes from "./routes/completions.js";
dotenv.config();
const app = express();

// Middlewares
app.use(cors()); // Allow requests from your React app
app.use(express.json()); // Parse JSON bodies

//connect to database
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/habit-tracker")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/completions", HabitCompletionRoutes);

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
