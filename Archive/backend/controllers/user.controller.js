import User from "../models/User.model.js";

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
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
