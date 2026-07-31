// routes/chat.js
import express from "express";
import { getConversations, getMessages, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/messages/:conversationId", protect, getMessages);
router.post("/message", protect, sendMessage);

export default router;
