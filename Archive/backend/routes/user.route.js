import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"; // ADDED
import upload from "../middleware/multer.js";
import { uploadProfilePicture } from "../controllers/user.controller.js";
import {
  getAllUsers,
  getModules,
  saveModules,
} from "../controllers/user.controller.js";

const router = express.Router();

// Use authMiddleware to get user from token
router.get("/get-modules", authMiddleware, getModules); // REMOVED :userId
router.post("/save-modules", authMiddleware, saveModules); // REMOVED :userId
router.get("/", getAllUsers);

router.post("/upload-profile", authMiddleware, upload.single("profilePicture"), uploadProfilePicture);

export default router;


