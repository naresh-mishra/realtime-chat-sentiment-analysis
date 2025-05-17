// JWT token generation and setting it in cookies with 7-day expiry
import jwt from "jsonwebtoken";

// Function to generate a JWT token and set it as a cookie on the response
export const generateToken = (userId, res) => {
   // Create a JWT token with userId payload and secret key, expires in 7 days
   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
   });

   // Set the JWT token in an HTTP-only cookie with security options
   res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (milliseconds)
      httpOnly: true,                   // Cookie not accessible via JavaScript
      sameSite: "strict",               // Prevent CSRF
      secure: process.env.NODE_ENV !== "development", // Use secure cookie in production (HTTPS)
   });

   // Return the generated token (optional usage)
   return token;
};
