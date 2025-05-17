import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./UseAuthStore";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // List of users available for chat
  const [messages, setMessages] = useState([]); // Messages exchanged with selected user
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user to chat with
  const [isUsersLoading, setIsUsersLoading] = useState(false); // Loading state for users
  const [isMessagesLoading, setIsMessagesLoading] = useState(false); // Loading state for messages

  const { socket } = useAuth(); // Socket instance from auth context
  const messageListenerRef = useRef(null); // Store message listener callback for cleanup

  // Fetch all users except logged-in user
  const getUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try {
      const res = await axiosInstance.get("/message/users");
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  // Fetch messages between logged-in user and selected user
  const getMessages = useCallback(async (userId) => {
    setIsMessagesLoading(true);
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      setMessages(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  // Send message to selected user
  const sendMessage = useCallback(async (messageData) => {
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  }, [selectedUser]);

  // Subscribe to real-time new messages via socket
  const subscribeToMessages = useCallback(() => {
    if (!socket || !selectedUser) return;

    const handleNewMessage = (newMessage) => {
      // Check if the message is from the selected user
      const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageFromSelectedUser) return;
      
      setMessages((prev) => {
        // Avoid adding duplicate messages
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    socket.on("newMessage", handleNewMessage);
    messageListenerRef.current = handleNewMessage; // Save listener for cleanup
  }, [socket, selectedUser]);

  // Unsubscribe from new message event to avoid leaks
  const unsubscribeFromMessages = useCallback(() => {
    if (socket && messageListenerRef.current) {
      socket.off("newMessage", messageListenerRef.current);
      messageListenerRef.current = null;
    }
  }, [socket]);

  // Auto subscribe/unsubscribe when selected user or socket changes
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

  return (
    <ChatContext.Provider
      value={{
        users,
        messages,
        selectedUser,
        isUsersLoading,
        isMessagesLoading,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
