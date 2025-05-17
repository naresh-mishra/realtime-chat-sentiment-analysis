import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../lib/axios";  // pre-configured axios instance
import toast from "react-hot-toast";           // toast notifications
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // User and loading states
  const [authUser, setAuthUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Connect socket with current userId query param
  const connectSocket = useCallback(() => {
    if (!authUser) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);  // update online users list from server event
    });

    newSocket.connect();
  }, [authUser]);

  // Disconnect socket cleanly
  const disconnectSocket = useCallback(() => {
    if (socket?.connected) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  // Check if user is authenticated by backend call
  const checkAuth = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      setAuthUser(res.data);
    } catch (error) {
      console.log("Error in checkAuth:", error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // Signup function
  const signup = async (data) => {
    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      setAuthUser(res.data);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsSigningUp(false);
    }
  };

  // Login function
  const login = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await axiosInstance.post("/auth/login", data);
      setAuthUser(res.data);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setAuthUser(null);
      toast.success("Logged out successfully");
      disconnectSocket();  // close socket connection on logout
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Update profile function
  const updateProfile = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      setAuthUser(res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updateProfile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Initial auth check on mount + cleanup socket on unmount
  useEffect(() => {
    checkAuth();
    return () => disconnectSocket();
  }, [checkAuth, disconnectSocket]);

  // Connect socket whenever user logs in and socket is not yet connected
  useEffect(() => {
    if (authUser && !socket) {
      connectSocket();
    }
  }, [authUser, socket, connectSocket]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isSigningUp,
        isLoggingIn,
        isUpdatingProfile,
        isCheckingAuth,
        onlineUsers,
        socket,
        login,
        logout,
        signup,
        checkAuth,
        updateProfile,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the auth context easily
export const useAuth = () => useContext(AuthContext);
