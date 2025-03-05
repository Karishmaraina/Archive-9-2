import User from "../models/User.model.js";
import path from "path";

// Fetch modules for authenticated user
export const getModules = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // CHANGED: Use req.user from authMiddleware
    res.json({ selectedModules: user.selectedModules || {} });
  } catch (error) {
    res.status(500).json({ message: "Error fetching modules", error });
  }
};

// Save modules for authenticated user
export const saveModules = async (req, res) => {
  const { selectedModules } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id, // CHANGED: Use authenticated user's ID
      { selectedModules },
      { new: true }
    );

    res.json({
      message: "Modules updated",
      selectedModules: user.selectedModules,
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving modules", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({},"name email profilePicture");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};


// // Upload Profile Picture
// export const uploadProfilePicture = async (req, res) => {
//   try {
//     const id = req.user?._id; // Get user ID from authMiddleware
//     if (!id) return res.status(401).json({ error: "Unauthorized: User ID not found" });

//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const imageUrl = req.file.path; // Cloudinary URL from Multer

//     const user = await User.findByIdAndUpdate(
//       req.user._id, // Now using authenticated user ID
//       { profilePicture: imageUrl },
//       { new: true }
//     );

//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.status(200).json({ message: "Profile picture updated", user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




export const uploadProfilePicture = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Add this
    const userId = req.user?._id; // Get user ID from authMiddleware
    if (!userId) return res.status(401).json({ error: "Unauthorized: User ID not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `/uploads/profile_pictures/${req.file.filename}`; // Local file path

    // Update user profile with new image URL
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Profile picture updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

