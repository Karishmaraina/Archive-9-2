import express from "express";
import { sendEmail, setPassword, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/send-email", sendEmail);
router.post("/set-password", setPassword);
router.post("/login", login);

export default router;
