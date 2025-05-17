// login page structure and fucntionality by which user can login into their account
import { useState } from "react"; // React hook for state management
import { useAuth } from "../store/UseAuthStore"; // Auth context hook
import { Link } from "react-router-dom"; // For navigation links
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react"; // Icons used

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [formData, setFormData] = useState({
    email: "", // Email input value
    password: "", // Password input value
  });
  const { login, isLoggingIng } = useAuth(); // Auth functions and loading state

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit reload
    login(formData); // Call login function with form data
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-base-200"> {/* Centered container with padding */}
      <div className="w-full max-w-md"> {/* Max width wrapper */}
        <div className="rounded-2xl border border-base-300 p-8 shadow-sm bg-base-100 space-y-8"> {/* Card with padding and shadow */}

          {/* Logo */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group"> {/* Logo icon and heading */}
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" /> {/* Message icon */}
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1> {/* Heading */}
              <p className="text-base-content/60">Sign in to your account</p> {/* Subheading */}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Form with spacing */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span> {/* Email label */}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" /> {/* Email icon */}
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10" // Input with padding for icon
                  placeholder="you@example.com"
                  value={formData.email} // Bind email state
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Update email on input change
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span> {/* Password label */}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" /> {/* Lock icon */}
                </div>
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password} // Bind password state
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Update password on input change
                />
                <button
                  type="button" // Button to toggle password visibility, not submit
                  className="absolute inset-y-0 right-0 pr-3 z-10 flex items-center focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();  // Prevents form submission or unwanted focus loss
                    setShowPassword((prev) => !prev); // Toggle showPassword state
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/60" /> // EyeOff icon when password is visible
                  ) : (
                    <Eye className="size-5 text-base-content/60" /> // Eye icon when password is hidden
                  )}
                </button>

              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIng}> {/* Submit button with loading state */}
              {isLoggingIng ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> {/* Loading spinner */}
                  Loading...
                </>
              ) : (
                "Sign in" // Button text when not loading
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "} {/* Prompt to create account */}
              <Link to="/signup" className="link link-primary">
                Create account {/* Signup navigation link */}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
