// profile page -you can update image form here and set the image also it contain user details
import { useState } from 'react'; // React hook for state management
import { useAuth } from '../store/UseAuthStore' // Auth context hook
import { Camera, Mail, User } from "lucide-react"; // Icons used

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuth(); // Auth user data and update functions
  const [selectedImg, setSelectedImg] = useState(null); // State for selected image preview

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    if (!file) return; // Exit if no file selected

    const reader = new FileReader(); // Create file reader

    reader.readAsDataURL(file); // Read file as base64 URL

    reader.onload = async () => {
      const base64Image = reader.result; // Get base64 result
      setSelectedImg(base64Image); // Set preview image state
      await updateProfile({ profilePic: base64Image }); // Call updateProfile with new image
    };
  };
  return (
    <div className="h-screen pt-20"> {/* Full screen height with top padding */}
      <div className="max-w-2xl mx-auto p-4 py-8"> {/* Centered max width container */}
        <div className="bg-base-300 rounded-xl p-6 space-y-8"> {/* Card with padding and spacing */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1> {/* Page title */}
            <p className="mt-2">Your profile information</p> {/* Subtitle */}
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"} // Show selected image or user profile or fallback avatar
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 " // Styling for avatar image
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""} // Animation and disable if updating
                `}
              >
                <Camera className="w-5 h-5 text-base-200" /> {/* Camera icon */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden" // Hidden file input
                  accept="image/*" // Accept only images
                  onChange={handleImageUpload} // Handle file change
                  disabled={isUpdatingProfile} // Disable while updating
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"} {/* Upload status */}
            </p>
          </div>

          {/* User details */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> {/* User icon */}
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p> {/* User full name */}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {/* Mail icon */}
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p> {/* User email */}
            </div>
          </div>

          {/* Account info section */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2> {/* Section title */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span> {/* Member since date formatted */}
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span> {/* Hardcoded active status */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default ProfilePage
