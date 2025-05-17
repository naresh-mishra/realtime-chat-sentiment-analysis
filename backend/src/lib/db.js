// Database connection setup with MongoDB using mongoose
import mongoose from "mongoose";

// Async function to connect to MongoDB
export const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        // Log a success message with the host info
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        // Log any errors during connection
        console.log("MongoDB connection error:", error);
    }
};
