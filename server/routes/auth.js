// routes/auth.js
import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, googleAuthUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuthUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);

export default router;
