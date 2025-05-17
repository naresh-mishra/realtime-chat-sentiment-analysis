import { useChat } from "../store/UseChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuth } from "../store/UseAuthStore";
import { formatMessageTime } from "../lib/utils";

// Map sentiment to corresponding emoji
const sentimentEmojiMap = {
  positive: "😊",
  neutral: "😐",
  negative: "😞",
};

// Map sentiment to corresponding text color classes
const sentimentColorMap = {
  positive: "text-green-500",
  neutral: "text-gray-400",
  negative: "text-red-500",
};

const ChatContainer = () => {
  // Destructure necessary values and functions from chat store
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChat();
  // Get authenticated user info from auth store
  const { authUser } = useAuth();
  // Ref to scroll to the latest message
  const messageEndRef = useRef(null);

  // Fetch messages and set up subscription when selected user changes
  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    // Cleanup subscription on unmount or when dependencies change
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show loading skeleton if messages are loading
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
      {/* Chat header with user info */}
      <ChatHeader />

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {/* Sender avatar */}
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

            {/* Message time and sentiment badge */}
            <div className="chat-header mb-1 flex items-center gap-2">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
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

            {/* Message content: image and/or text */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Input area to type and send messages */}
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
