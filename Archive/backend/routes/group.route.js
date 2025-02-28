import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createGroup } from "../controllers/group.controller.js";
const router = express.Router();

router.post("/", createGroup);

export default router;
