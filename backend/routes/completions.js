import express from "express";
import HabitCompletion from "../models/HabitCompletion.js";
import auth from "../middleware/auth.js"; // Import JWT middleware
const router = express.Router();

// POST - Mark habits as complete
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from JWT token (more secure)
    const { habitId, completedDate, value, notes } = req.body;

    // Use today's date if no date provided
    const dateToUse = completedDate ? new Date(completedDate) : new Date();

    const existingCompletion = await HabitCompletion.findOne({
      habitId,
      userId,
      completedDate: dateToUse,
    });

    if (existingCompletion) {
      return res.status(400).json({
        success: false,
        message: "Habit already marked as complete for this date",
      });
    }

    const completion = new HabitCompletion({
      habitId,
      userId,
      completedDate: dateToUse,
      value,
      notes,
    });

    await completion.save();

    res.status(201).json({
      success: true,
      message: "Habit marked as complete",
      completion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// DELETE - Unmark habit completion
router.delete("/", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from JWT token
    const { habitId, completedDate } = req.body;

    // Use today's date if no date provided
    const dateToUse = completedDate ? new Date(completedDate) : new Date();

    const completion = await HabitCompletion.findOneAndDelete({
      habitId,
      userId,
      completedDate: dateToUse,
    });

    if (!completion) {
      return res.status(404).json({
        success: false,
        message: "No completion found for this habit on this date",
      });
    }

    res.json({
      success: true,
      message: "Habit completion removed",
      completion, // Fixed: was "deletion"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET completions for today
router.get("/today", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from JWT token
    const today = new Date().toISOString().split("T")[0];

    const completions = await HabitCompletion.find({
      userId,
      completedDate: new Date(today),
    }).populate("habitId", "name category");

    res.json({
      success: true,
      completions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET completions for a specific habit (useful for streak calculation)
router.get("/habit/:habitId", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { habitId } = req.params;

    const completions = await HabitCompletion.find({
      habitId,
      userId,
    }).sort({ completedDate: -1 }); // Most recent first

    res.json({
      success: true,
      completions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET completions within a date range (for analytics later)
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { habitId, startDate, endDate } = req.query;

    let query = { userId };

    // Add habitId filter if provided
    if (habitId) {
      query.habitId = habitId;
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      query.completedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const completions = await HabitCompletion.find(query)
      .populate("habitId", "name category")
      .sort({ completedDate: -1 });

    res.json({
      success: true,
      completions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
