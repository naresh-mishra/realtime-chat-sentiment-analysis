import { useChat } from "../store/UseChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuth } from "../store/UseAuthStore";
import { formatMessageTime } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Map sentiment types to emoji icons for display
const sentimentEmojiMap = {
  positive: "😊",
  neutral: "😐",
  negative: "😞",
};

// Map sentiment types to Tailwind CSS text color classes
const sentimentColorMap = {
  positive: "text-green-500",
  neutral: "text-gray-400",
  negative: "text-red-500",
};

const ChatContainer = () => {
  // Extract chat-related data and functions from chat store
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChat();

  // Get current authenticated user info from auth store
  const { authUser } = useAuth();

  // Ref to the bottom of the message list to auto-scroll on new messages
  const messageEndRef = useRef(null);

  // Effect to fetch messages and subscribe to message updates whenever selected user changes
  useEffect(() => {
    // Fetch chat messages of the selected user
    getMessages(selectedUser._id);

    // Start listening for new messages via subscription
    subscribeToMessages();

    // Cleanup subscription on component unmount or dependency change
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Effect to scroll chat container to bottom when messages update
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show loading skeleton while messages are being fetched
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat header showing selected user's info */}
      <ChatHeader />

      {/* Scrollable container for chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* AnimatePresence enables animation for components entering and leaving the DOM */}
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            // Motion div for animated message appearance/disappearance and layout changes
            <motion.div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
              // Initial animation state: faded out and shifted horizontally (right for own messages, left otherwise)
              initial={{ opacity: 0, x: message.senderId === authUser._id ? 100 : -100 }}
              // Animate to fully visible and centered position
              animate={{ opacity: 1, x: 0 }}
              // Animate exit state (fades out and shifts)
              exit={{ opacity: 0, x: message.senderId === authUser._id ? 100 : -100 }}
              // Spring physics animation for smooth movement
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              // Enables smooth layout transitions when message list changes
              layout
            >
              {/* User avatar next to each message */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              {/* Message metadata: timestamp and sentiment badge */}
              <div className="chat-header mb-1 flex items-center gap-2">
                {/* Formatted message timestamp */}
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>

                {/* Sentiment emoji badge with color */}
                {message.sentiment && (
                  <span
                    className={`text-sm font-semibold ${
                      sentimentColorMap[message.sentiment] || "text-gray-400"
                    }`}
                    title={`Sentiment: ${message.sentiment}`}
                    aria-label={`Sentiment: ${message.sentiment}`}
                  >
                    {sentimentEmojiMap[message.sentiment]}
                  </span>
                )}
              </div>

              {/* Chat bubble containing message image and/or text */}
              <div className="chat-bubble flex flex-col">
                {/* Show image if message includes one */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}

                {/* Show text content of message */}
                {message.text && <p>{message.text}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input box for sending new messages */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
