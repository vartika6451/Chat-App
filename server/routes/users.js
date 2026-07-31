// routes/users.js
import express from "express";
import { getUserProfile, updateUserProfile, searchUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile/:userId", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/search", protect, searchUsers);

export default router;
