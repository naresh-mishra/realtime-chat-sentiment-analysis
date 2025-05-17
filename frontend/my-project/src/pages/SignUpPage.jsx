// sign up page if user is visiting the website first time they need to register first
import { useState } from "react"; // React hook for state management
import { useAuth } from "../store/UseAuthStore"; // Auth context hook
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react"; // Icons used
import { Link } from "react-router-dom"; // Routing link component
import toast from "react-hot-toast"; // Notification library

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility state
  const [formData, setFormData] = useState({
    fullName: "", // User full name
    email: "", // User email
    password: "", // User password
  });

  const { isSigningUp, signup } = useAuth(); // Signup state and function from auth

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required"); // Validate full name
    if (!formData.email.trim()) return toast.error("Email is required"); // Validate email presence
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format"); // Validate email format
    if (!formData.password) return toast.error("Password is required"); // Validate password presence
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters"); // Validate password length

    return true; // Return true if all validations pass
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const success = validateForm(); // Validate form data

    if (success === true) signup(formData); // Call signup if validation passed
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-base-200"> {/* Full screen with centered content */}
      <div className="w-full max-w-md"> {/* Container with max width */}
        <div className="rounded-2xl border border-base-300 p-8 shadow-sm bg-base-100 space-y-8"> {/* Card with border and shadow */}

          <div className="flex flex-col items-center gap-2 group"> {/* Header with icon and text */}
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare className="size-6 text-primary" /> {/* Icon */}
            </div>
            <h1 className="text-2xl font-bold mt-2">Create Account</h1> {/* Title */}
            <p className="text-base-content/60">Get started with your free account</p> {/* Subtitle */}
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span> {/* Label */}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" /> {/* Icon inside input */}
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10" // Input with padding for icon
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} // Update fullName in form data
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" /> {/* Email icon */}
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Update email
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" /> {/* Lock icon */}
                </div>
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Update password
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 z-10 flex items-center focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();  // Prevent default button behavior
                    setShowPassword((prev) => !prev); // Toggle password visibility
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/60" /> // Eye off icon
                  ) : (
                    <Eye className="size-5 text-base-content/60" /> // Eye icon
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}> {/* Submit button with loading state */}
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> {/* Loading spinner */}
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary"> {/* Link to login */}
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
