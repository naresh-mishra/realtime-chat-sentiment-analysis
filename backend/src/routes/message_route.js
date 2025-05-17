// Message router — defines the message-related API endpoints
import express from "express";  // Importing Express for routing
import { protectRoute } from "../middleware/auth_middleware.js"; // Middleware to protect routes (ensures user is authenticated)
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message_controller.js"; // Importing message controller functions

// Create a new router instance
const router = express.Router();

// GET request to fetch users for the chat sidebar (only accessible if authenticated)
router.get("/users", protectRoute, getUsersForSidebar);

// GET request to fetch messages with a specific user (by user ID)
router.get("/:id", protectRoute, getMessages);

// POST request to send a message to a specific user (by user ID)
router.post("/send/:id", protectRoute, sendMessage);

// Export the router to be used in the main server file
export default router;
