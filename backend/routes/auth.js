import express from "express";
import bcryptjs from "bcryptjs"; // Import bcryptjs for hashing passwords
import User from "../models/User"; // Import User model
const router = express.Router(); // Initialize router

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body; //Extract data sent from frontend request body

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object using the User model (from Mongoose schema)

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save(); //save to database

    // Send back user info (without password)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id, //unique mongodb generated id
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: " Invalid Credentials",
      });
    }
    res.json({
      //after password matches backend replie with sucess message
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
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
