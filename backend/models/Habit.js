// models/Habit.js
import mongoose from "mongoose";

export const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // links to User
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["fitness", "health", "other"],
      default: "other",
    },
    type: { type: String, enum: ["habit", "workout"], default: "habit" },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    targetValue: { type: Number, default: 0 }, // reps, minutes, etc.
    unit: { type: String, enum: ["reps", "minutes", "miles"], default: "reps" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
); // automatically adds createdAt and updatedAt

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
