// socket/socketHandler.js
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

// Map to store active user connections (userId -> ws)
export const clients = new Map();

/**
 * Sends a WebSocket message payload to a specific user if they are online
 * @param {string} userId 
 * @param {object} payload 
 */
export const sendMessageToUser = (userId, payload) => {
  const ws = clients.get(userId);
  if (ws && ws.readyState === 1) { // 1 is WebSocket.OPEN
    try {
      ws.send(JSON.stringify(payload));
      console.log(`📡 [SOCKET] Dispatched event to User ID: ${userId}`);
      return true;
    } catch (err) {
      console.error(`❌ [SOCKET] Error sending to User ID ${userId}:`, err);
      clients.delete(userId);
    }
  }
  return false;
};

export const initSocket = (server) => {
  const wss = new WebSocketServer({ noServer: true });

  console.log("⚡ [SOCKET] WebSocket server setup initialized");

  // Handle socket connection upgrades from Express HTTP server
  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", async (ws, request) => {
    // Parse token from query parameters
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const token = url.searchParams.get("token");

    if (!token) {
      console.warn("⚠️ [SOCKET] Connection rejected: No token provided");
      ws.close(1008, "Token Required");
      return;
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      console.warn("⚠️ [SOCKET] Connection rejected: Invalid token");
      ws.close(1008, "Invalid Token");
      return;
    }

    // Register active user connection
    clients.set(userId, ws);
    console.log(`🔌 [SOCKET] User ${userId} connected successfully`);

    // Send welcome payload
    ws.send(JSON.stringify({ 
      type: "WELCOME", 
      message: "Blink Link Established",
      userId
    }));

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`📨 [SOCKET] Received event: ${data.type} from user: ${userId}`);
        
        if (data.type === "SEND_MESSAGE") {
          const { conversationId, text } = data.payload;
          
          if (!conversationId || !text) return;

          // Save message to database
          const newMessage = await prisma.message.create({
            data: {
              text,
              senderId: userId,
              conversationId,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                }
              }
            }
          });

          // Update conversation updatedAt timestamp
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          });

          // Fetch all conversation participants
          const participants = await prisma.conversationParticipant.findMany({
            where: { conversationId },
          });

          // Broadcast to all active participants in the conversation
          const broadcastPayload = {
            type: "NEW_MESSAGE",
            payload: {
              id: newMessage.id,
              conversationId,
              senderId: newMessage.senderId,
              text: newMessage.text,
              createdAt: newMessage.createdAt,
              sender: newMessage.sender,
            }
          };

          participants.forEach((p) => {
            sendMessageToUser(p.userId, broadcastPayload);
          });
        }
      } catch (err) {
        console.error("❌ [SOCKET MESSAGE ERROR]", err);
      }
    });

    ws.on("close", () => {
      console.log(`🔌 [SOCKET] User ${userId} disconnected`);
      clients.delete(userId);
    });
  });

  return wss;
};
