import { NlpManager } from 'node-nlp'; // Import NLP library for sentiment analysis
import User from "../models/user_model.js";
import Message from '../models/message_model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from "../lib/socket.js";

// Initialize NLP manager with English language and named entity recognition forced
const manager = new NlpManager({ languages: ['en'], forceNER: true });

// Get users to display in the sidebar excluding currently logged-in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Get current user ID from auth middleware
    // Find all users except the logged-in user, exclude password field for security
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers); // Send filtered users to frontend
  } catch (error) {
    console.error("Error in getUsersForSidebar", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch messages exchanged between logged-in user and specified user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Receiver user ID from URL param
    const myId = req.user._id;                // Sender (logged-in user) ID

    // Query messages where sender/receiver are either user, to get full conversation
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    });

    res.status(200).json(messages); // Return message history
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send a new message from logged-in user to a specified receiver
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;   // Message text and optional image from request body
    const { id: receiverId } = req.params; // Receiver user ID from URL param
    const senderId = req.user._id;      // Sender user ID from auth middleware

    let imageUrl;
    if (image) {
      // Upload image to Cloudinary if provided and get the hosted URL
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Initialize sentiment analysis variables
    let sentiment = 'neutral';
    let sentimentScore = 0;

    if (text) {
      // Process the text using NLP manager to get sentiment
      const result = await manager.process('en', text);
      sentimentScore = result.sentiment.score; // Numerical sentiment score
      // Map NLP sentiment vote to our sentiment categories
      sentiment =
        result.sentiment.vote === 'positive'
          ? 'positive'
          : result.sentiment.vote === 'negative'
            ? 'negative'
            : 'neutral';
    }

    // Create new message document with all info including sentiment and image URL
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      sentiment,
      sentimentScore,
    });

    // Save message to database
    await newMessage.save();

    // Find receiver's socket ID to send real-time notification via socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // Emit new message event to receiver
    }

    // Send the saved message as API response
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
