// Cloudinary setup — used for image upload and storage
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary v2 API
import { config } from "dotenv";               // Import dotenv to load environment variables

// Load environment variables from .env file
config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Export the configured Cloudinary instance for use elsewhere in the app
export default cloudinary;
