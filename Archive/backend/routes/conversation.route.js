import express from "express";
import {
  sendMessage,
  getAllConversations,
  getMessages,
  deleteConversation,
  clearConversation,
  readConversation,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/send-message", sendMessage);
router.get("/:userId", getAllConversations);
router.get("/messages/:conversationId", getMessages);
router.delete("/:conversationId", deleteConversation);
router.put("/clear/:conversationId", clearConversation);
router.post("/read/:conversationId", readConversation);

export default router;
