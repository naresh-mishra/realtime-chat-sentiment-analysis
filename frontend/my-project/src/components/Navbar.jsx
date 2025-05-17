import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/UseAuthStore";
import { LogOut, MessageSquare, Moon, Sun, User } from "lucide-react";

const Navbar = () => {
  // Get logout function and authenticated user from auth store
  const { logout, authUser } = useAuth();

  // State to track if dark mode is enabled, initialized from localStorage
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  // Effect to update document attribute and localStorage whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Toggle between dark and light mode
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      {/* Container for navbar content */}
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left section: Logo and site name */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">QuickChat</h1>
            </Link>
          </div>

          {/* Right section: Theme toggle, profile and logout */}
          <div className="flex items-center gap-2">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="btn btn-sm btn-ghost gap-2"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span className="hidden sm:inline">{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Show profile link and logout button if user is authenticated */}
            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
