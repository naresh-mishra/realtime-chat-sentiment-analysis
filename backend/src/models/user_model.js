// User model — defines how user data (used in login/signup) is stored in the database
import mongoose from "mongoose";

// Define the schema for a User
const userSchema = new mongoose.Schema({
    // User's email (must be unique and required)
    email: {
        type: String,
        required: true,
        unnique: true, // Typo: should be "unique", but left unchanged as per your instruction
    },
    // Full name of the user
    fullName: {
        type: String,
        required: true,
    },
    // Hashed password for the user
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
    // Optional profile picture URL or path
    profilePic: {
        type: String,
        default: "",
    },
}, { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

// Export the User model for use in controllers and routes
export default User;
