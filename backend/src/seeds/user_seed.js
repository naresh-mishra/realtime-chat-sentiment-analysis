import { config } from "dotenv";           // Load environment variables from .env file
import { connectDB } from "../lib/db.js";  // Function to connect to MongoDB
import User from "../models/user_model.js"; // User model to insert data into users collection

config(); // Initialize dotenv config to load environment variables

// Array of user objects to seed the database with sample users (both female and male)
const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    fullName: "Emma Thompson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  // ... more female users ...
  // Male Users
  {
    email: "james.anderson@example.com",
    fullName: "James Anderson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  // ... more male users ...
];

// Async function to seed the user data into MongoDB
const seedDatabase = async () => {
  try {
    await connectDB(); // Connect to MongoDB using connection string from env

    // Insert all users in seedUsers array into the User collection at once
    await User.insertMany(seedUsers);
    console.log("Database seeded successfully"); // Confirmation message
  } catch (error) {
    console.error("Error seeding database:", error); // Log any errors during seeding
  }
};

// Immediately call the seedDatabase function to start the seeding process
seedDatabase();
