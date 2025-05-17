// Importing required modules
import express from "express";              // Express framework for server setup
import dotenv from "dotenv";                // dotenv to load environment variables from .env file
import { connectDB } from "./lib/db.js";    // Custom function to connect to MongoDB
import authRoute from "./routes/auth_route.js";         // Auth-related API routes
import messageRoutes from './routes/message_route.js';  // Message-related API routes
import cookieParser from 'cookie-parser';   // Middleware to parse cookies
import cors from "cors";                    // Middleware for enabling Cross-Origin Resource Sharing
import { app, server } from "./lib/socket.js"; // Express app and socket server setup

// Load environment variables
dotenv.config();
const PORT = process.env.PORT;  // Fetch the PORT value from the .env file

// Middleware to parse incoming JSON requests (up to 1MB)
app.use(express.json({ limit: '1mb' }));

// Middleware to parse cookies in requests
app.use(cookieParser());

// Enable CORS for the frontend (adjust the origin to match your frontend app)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true  // Allow cookies and credentials to be sent
}));

// Middleware to parse URL-encoded data (form data), up to 1MB
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Set up API routes for authentication and messaging
app.use('/api/auth', authRoute);           // Routes starting with /api/auth use authRoute
app.use('/api/message', messageRoutes);    // Routes starting with /api/message use messageRoutes

// Start the server and connect to the database
server.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB();  // Connect to MongoDB once the server starts
});
