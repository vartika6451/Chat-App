// routes/cards.js
import express from "express";
import { getTemplates, generateCard } from "../controllers/cardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/templates", protect, getTemplates);
router.post("/generate", protect, generateCard);

export default router;
