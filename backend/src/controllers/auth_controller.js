import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user_model.js';
import bcrypt from 'bcryptjs'

// Signup functionality - backend API to register a new user
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if all required fields are provided
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All field are required" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" });
        }

        // Check if the email already exists in the database
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance with hashed password
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            // Generate JWT token and set cookie
            generateToken(newUser._id, res);

            // Save the new user in the database
            await newUser.save();

            // Respond with user info (excluding password)
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid User Data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login functionality - backend API to authenticate a user
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Compare provided password with stored hashed password
        const isPassswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPassswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token and set cookie
        generateToken(user._id, res);

        // Respond with user info
        res.status(200).json({
            _id: user._id,
            fullName: user.email,          // Note: looks like this should be fullName? Left as-is.
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Logout functionality - backend API to clear JWT cookie and logout user
export const logout = (req, res) => {
    try {
        // Clear the jwt cookie by setting maxAge to 0
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update Profile functionality - backend API to update user's profile picture
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        // Validate that profilePic is provided
        if (!profilePic) {
            return res.status(400).json({ message: "profile pic is required" });
        }

        // Upload the profile picture to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // Update user's profilePic in database with the Cloudinary URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        // Respond with updated user data
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("error in update profile", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Check Authentication functionality - return current user info if logged in
export const checkAuth = (req, res) => {
    try {
        // req.user is set by protectRoute middleware if user is authenticated
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in check controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
