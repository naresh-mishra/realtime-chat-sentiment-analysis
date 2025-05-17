// Message model — defines how the message documents will look in the database
import mongoose from "mongoose";

// Define the message schema structure
const messageSchema = new mongoose.Schema(
    {
        // Sender's user ID (reference to User model)
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Receiver's user ID (reference to User model)
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Optional text content of the message
        text: {
            type: String,
        },
        // Optional image URL or path in the message
        image: {
            type: String,
        },
        // Sentiment analysis result of the message (positive, neutral, negative)
        sentiment: {
            type: String,
            enum: ['positive', 'neutral', 'negative'],
            default: 'neutral',
        },
        // Sentiment score (e.g., for more detailed analysis)
        sentimentScore: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Message model based on the schema
const Message = mongoose.model("Message", messageSchema);

// Export the Message model for use in other parts of the app
export default Message;
