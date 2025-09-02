// models/HabitCompletion.js
import mongoose from "mongoose";

const habitCompletionSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    }, // links to a habit
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // links to a user
    completedDate: { type: Date, required: true }, // store the completion date
    value: { type: Number, default: null }, // optional: actual value achieved
    notes: { type: String, default: "" }, // optional notes
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
// Only adds createdAt, no updatedAt needed

const HabitCompletion = mongoose.model(
  "HabitCompletion",
  habitCompletionSchema
);
export default HabitCompletion;
