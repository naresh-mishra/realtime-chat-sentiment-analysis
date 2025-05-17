// Defining the router API for authentication (login, signup, etc.)
import express from "express";  // Importing Express for routing
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth_controller.js"; // Importing auth controller functions
import { protectRoute } from "../middleware/auth_middleware.js"; // Middleware to protect routes (authentication check)

// Create a new router instance
const router = express.Router();

// Route to handle user signup (register new user)
router.post("/signup", signup);

// Route to handle user login
router.post("/login", login);

// Route to handle user logout
router.post("/logout", logout);

// Route to update user profile (only accessible if logged in)
router.put("/update-profile", protectRoute, updateProfile);

// Route to check if user is authenticated (used to verify login status)
router.get("/check", protectRoute, checkAuth);

// Export the router to be used in the main server file
export default router;
