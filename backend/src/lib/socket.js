// Socket.io setup for real-time communication
import { Server } from "socket.io"; // Import Socket.io server class
import http from "http";            // Import Node's HTTP module to create server
import express from "express";      // Import Express framework

const app = express();              // Initialize Express app
const server = http.createServer(app); // Create HTTP server using Express app

// Initialize Socket.io server with CORS configuration allowing frontend origin
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow only this origin for security
  },
});

// Object to store currently connected users with their socket IDs
const userSocketMap = {}; // Format: { userId: socketId }

// Function to get the socket ID of a specific user by their userId
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Listen for client connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Extract userId sent by client during handshake query parameters
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id; // Map userId to socket.id

  // Broadcast the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for when a user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // Remove user from the online users map
    delete userSocketMap[userId];

    // Broadcast updated list of online users after disconnection
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export io (Socket.io server), app (Express app), and server (HTTP server)
export { io, app, server };
