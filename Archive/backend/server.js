import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
import fs from "fs";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import groupRoutes from "./routes/group.route.js";
import conversationRoutes from "./routes/conversation.route.js";
// import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Serve static profile images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// File upload setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({
    filename: req.file.filename,
    path: path.join("uploads", req.file.filename),
    success: true,
    url: fileUrl,
  });
});

// File download route
app.get("/download/:filename", (req, res) => {
  const filePath = path.resolve("uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

const onlineUsers = new Map(); // Store online users (userId -> socketId)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/conversations", conversationRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => onlineUsers.set(userId, socket.id));

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) onlineUsers.delete(userId);
    }
    console.log("User disconnected:", socket.id);
  });
});

const handleUpdateUserRT = (receiverIds, msg, data) => {
  receiverIds.forEach((userId) => {
    const socketId = onlineUsers.get(userId.toString());
    if (socketId) io.to(socketId.toString()).emit(msg, data);
  });
};

export { io, handleUpdateUserRT };

server.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
