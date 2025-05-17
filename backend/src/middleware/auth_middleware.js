// Middleware to check if a user is currently logged in using JWT authentication
import jwt from "jsonwebtoken";           // For verifying JWT tokens
import User from "../models/user_model.js"; // Import User model to fetch user details from DB

// protectRoute middleware to secure private routes
export const protectRoute = async (req, res, next) => {
  try {
    // Extract JWT token from cookies
    const token = req.cookies.jwt;

    // If no token found, deny access
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token verification fails
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized -Invalid Token" });
    }

    // Find the user in the database using decoded userId, excluding the password field
    const user = await User.findById(decoded.userId).select("-password");

    // If user is not found in the database
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to the request for downstream access
    req.user = user;

    // Continue to the next middleware or route handler
    next();

  } catch (error) {
    // Handle errors, such as token issues or DB problems
    console.log("Error in protectRoute Middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
