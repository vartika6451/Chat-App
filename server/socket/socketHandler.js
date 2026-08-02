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

          // Trigger simulated AI reply if conversation contains an AI bot
          triggerAIReplyIfNeeded(conversationId, text, userId);
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

// Keep track of AI users and their auto-reply functions
const AI_BOTS = {
  jarvis: {
    name: "Jarvis AI",
    getReply: (userMsg) => {
      const msg = userMsg.toLowerCase();
      if (msg.includes("hello") || msg.includes("hi")) {
        return "Hello! I am Jarvis, your virtual assistant. How can I help you today?";
      }
      if (msg.includes("help")) {
        return "I can help you navigate Blink, manage your cards, or answer general questions. What do you need assistance with?";
      }
      if (msg.includes("time")) {
        return `The current time is ${new Date().toLocaleTimeString()}.`;
      }
      if (msg.includes("who are you")) {
        return "I am Jarvis, an AI assistant configured to help you test the Blink chat application.";
      }
      return "Understood. I'm analyzing your request. Is there anything specific you would like me to do?";
    }
  },
  copilot: {
    name: "Blink Copilot",
    getReply: (userMsg) => {
      const msg = userMsg.toLowerCase();
      if (msg.includes("hello") || msg.includes("hi")) {
        return "Hey there! Blink Copilot here. Ready to write some code or whiteboard some ideas? 🚀";
      }
      if (msg.includes("code") || msg.includes("javascript") || msg.includes("react")) {
        return "React is awesome! For example, a simple functional component looks like this:\n```jsx\nfunction Welcome() {\n  return <h1>Hello from Copilot!</h1>;\n}\n```\nWhat are you coding right now?";
      }
      if (msg.includes("bug") || msg.includes("error")) {
        return "Oh, a bug? Describe what's happening or paste the stack trace! Let's debug it together.";
      }
      return "That sounds interesting! Tell me more or paste some code, and let's work on it together.";
    }
  },
  echo_bot: {
    name: "Echo Bot",
    getReply: (userMsg) => {
      return `Echo: "${userMsg}"`;
    }
  }
};

export const triggerAIReplyIfNeeded = async (conversationId, userMessageText, senderId) => {
  try {
    // 1. Fetch conversation participants to see if any are AI bots
    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          }
        }
      }
    });

    // Find if any participant is an AI bot and NOT the sender of the incoming message
    const aiParticipant = participants.find(
      (p) => AI_BOTS[p.user.username] && p.userId !== senderId
    );

    if (!aiParticipant) {
      return; // No AI participant to reply
    }

    const botConfig = AI_BOTS[aiParticipant.user.username];
    const botUser = aiParticipant.user;

    // Generate reply text
    const replyText = botConfig.getReply(userMessageText);

    // Simulate typing/response delay
    setTimeout(async () => {
      try {
        // Save the AI message to the database
        const aiMessage = await prisma.message.create({
          data: {
            text: replyText,
            senderId: botUser.id,
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

        // Update the conversation's updated timestamp
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        // Broadcast the new AI message to all participants
        const broadcastPayload = {
          type: "NEW_MESSAGE",
          payload: {
            id: aiMessage.id,
            conversationId,
            senderId: aiMessage.senderId,
            text: aiMessage.text,
            createdAt: aiMessage.createdAt,
            sender: aiMessage.sender,
          }
        };

        participants.forEach((p) => {
          sendMessageToUser(p.userId, broadcastPayload);
        });

        console.log(`🤖 [AI BOT] ${botUser.username} replied in conversation: ${conversationId}`);
      } catch (err) {
        console.error("❌ [AI BOT REPLY ERROR]", err);
      }
    }, 1500); // 1.5s delay to simulate typing
  } catch (err) {
    console.error("❌ [AI BOT CHECK ERROR]", err);
  }
};
