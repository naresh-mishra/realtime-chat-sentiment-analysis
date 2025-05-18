import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/UseAuthStore";
import { LogOut, MessageSquare, Moon, Sun, User } from "lucide-react";
import { motion } from "framer-motion";

// Wrap Link for framer motion animations
const MotionLink = motion(Link);

const Navbar = () => {
  const { logout, authUser } = useAuth();
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">QuickChat</h1>
            </Link>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              className="btn btn-sm btn-ghost gap-2"
              aria-label="Toggle Theme"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span className="hidden sm:inline">{isDark ? "Light Mode" : "Dark Mode"}</span>
            </motion.button>

            {authUser && (
              <>
                <MotionLink
                  to={"/profile"}
                  className="btn btn-sm gap-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </MotionLink>

                <motion.button
                  className="flex gap-2 items-center"
                  onClick={logout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
