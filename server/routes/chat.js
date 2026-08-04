// routes/chat.js
import express from "express";
import { 
  getConversations, 
  getMessages, 
  sendMessage,
  scheduleMessage,
  getScheduledMessages,
  deleteScheduledMessage,
  scheduleCall,
  getScheduledCalls,
  deleteScheduledCall,
  getConversationEmotion
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/messages/:conversationId", protect, getMessages);
router.get("/conversation/:conversationId/emotion", protect, getConversationEmotion);
router.post("/message", protect, sendMessage);

// Scheduled Messages Routes
router.post("/scheduled-messages", protect, scheduleMessage);
router.get("/scheduled-messages/:conversationId", protect, getScheduledMessages);
router.delete("/scheduled-messages/:id", protect, deleteScheduledMessage);

// Scheduled Calls Routes
router.post("/scheduled-calls", protect, scheduleCall);
router.get("/scheduled-calls/:conversationId", protect, getScheduledCalls);
router.delete("/scheduled-calls/:id", protect, deleteScheduledCall);

export default router;
