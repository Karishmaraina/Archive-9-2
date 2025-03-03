import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  selectedModules: {
    type: Map,
    of: [String], // Store selected sidebar modules
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
