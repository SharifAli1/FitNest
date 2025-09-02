import express from "express";
import Habit from "../models/Habit.js";
import HabitCompletion from "../models/HabitCompletion.js";
const router = express.Router();

// GET all habits for a user
// For now, we'll pass userId in query params (USE JWT LATER)
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query; //get method so use query
    const habits = await Habit.find({ userId, isActive: true }); //searches habits collection,gets only the ones for the user and only ones that active
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format //check if its completed today

    const habitsWithStatus = await Promise.all(
      //waits for all async map operations to finish, returning an array of habits with their completion status.
      habits.map(async (habit) => {
        const todayCompletion = await HabitCompletion.findOne({
          habitId: habit._id,
          completedDate: new Date(today),
        });

        return {
          ...habit.toObject(),
          isCompletedToday: !!todayCompletion,
        };
      })
    );
    res.json({
      success: true,
      habits: habitsWithStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// POST create a new habit
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      category,
      type,
      frequency,
      targetValue,
      unit,
    } = req.body;

    const habit = new Habit({
      userId,
      name,
      description,
      category,
      type,
      frequency,
      targetValue,
      unit,
      isActive: true,
    });
    await habit.save();
    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

//update habits
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const habit = await Habit.findByIdAndUpdate(
      id,
      updateData, //updates data
      { new: true } //return the updated document tells mongoose to return this new one
    );
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }
    res.json({
      success: true,
      message: "Habit updated successfully",
      habit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
//delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findByIdAndDelete(id);
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.json({
      success: true,
      message: "Habit permanently deleted",
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
