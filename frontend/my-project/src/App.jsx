// React app routing setup with react-router-dom
// Uses lazy loading to load components only when they are needed for the first time

import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Lazy load components for better performance (code splitting)
const Navbar = lazy(() => import('./components/Navbar'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

import { useAuth } from "./store/UseAuthStore";  // Custom auth hook to get user auth status
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";       // For showing toast notifications

const App = () => {
  // Extract user auth info and loading status from custom auth store
  const { authUser, isCheckingAuth, onlineUsers } = useAuth();

  console.log({ authUser });       // Log current authenticated user info (for debugging)
  console.log(onlineUsers);        // Log online users info

  // Show loading spinner while auth status is being checked and user is not authenticated yet
  if (isCheckingAuth && !authUser)
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );

  return (
    <div>
      {/* Navbar is outside Suspense since it is lazy loaded */}
      <Navbar />

      {/* Suspense to show fallback loading UI while lazily loaded components are loading */}
      <Suspense fallback={<div><Loader2 className="h-5 w-5 animate-spin" />Loading...</div>}>
        <Routes>
          {/* Home route: accessible only if user is authenticated, otherwise redirect to login */}
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />

          {/* Signup route: accessible only if user NOT authenticated, otherwise redirect to home */}
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

          {/* Login route: accessible only if user NOT authenticated, otherwise redirect to home */}
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

          {/* Profile route: accessible only if user is authenticated, otherwise redirect to login */}
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>

      {/* Toaster for showing toast messages globally */}
      <Toaster />
    </div>
  );
}

export default App;
