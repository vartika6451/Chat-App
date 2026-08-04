import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket/socketHandler.js";
import { initScheduler } from "./utils/scheduler.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import chatRoutes from "./routes/chat.js";
import cardRoutes from "./routes/cards.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Apply middlewares
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`🌐 [HTTP] ${req.method} ${req.url}`);
  next();
});

// Connect to Database (mock)
connectDB();

// Initialize WebSocket transmission socket
initSocket(server);

// Initialize scheduler
initScheduler();

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/cards", cardRoutes);

// Root endpoint stub
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Blink API",
    status: "online",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ [SERVER ERROR]", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error occurred",
  });
});

// Listen on configured port
server.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});