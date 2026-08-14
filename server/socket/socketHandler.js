// socket/socketHandler.js
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { classifyEmotion } from "../utils/emotionClassifier.js";


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

          // Fetch participants and save message in parallel to reduce remote DB query sequence latency
          const [newMessage, participants] = await Promise.all([
            prisma.message.create({
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
            }),
            prisma.conversationParticipant.findMany({
              where: { conversationId },
            })
          ]);

          // Update conversation updatedAt timestamp in background
          prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          }).catch(err => console.error("❌ [SOCKET] Conversation timestamp update error:", err));

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

          // Trigger emotion classification broadcast in background
          broadcastEmotionUpdate(conversationId);

          // Trigger simulated AI reply in background
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
    getReply: async (userMsg) => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const prompt = `You are Jarvis AI, a highly professional, efficient, and friendly AI assistant. The user is talking to you in a chat app. Keep your response brief, helpful, professional, and limited to 2-3 sentences.
User message: "${userMsg}"
Jarvis AI response:`;
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              })
            }
          );
          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return reply.trim();
          }
        } catch (err) {
          console.warn("⚠️ [AI BOT] Gemini reply failed, using local rules:", err.message);
        }
      }

      // Local fallback parser
      const msg = userMsg.toLowerCase().trim();
      
      // Greetings
      if (/^(hi|hello|hey|hola|greet|hell|he+y)/.test(msg)) {
        return "Hello! I am Jarvis, your professional AI assistant. How can I help you today?";
      }
      
      // Help
      if (msg.includes("help") || msg.includes("assist") || msg.includes("support")) {
        return "I am here to assist you. You can ask me to help you navigate Blink, manage greeting cards, schedule calls, or answer general inquiries. What can I do for you?";
      }

      // Time
      if (msg.includes("time") || msg.includes("date")) {
        return `The current local time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Please let me know if you need help scheduling any calls or messages around this time.`;
      }

      // Who are you / background
      if (msg.includes("who are you") || msg.includes("your name") || msg.includes("what is jarvis")) {
        return "I am Jarvis AI, a professional virtual assistant integrated into Blink. I am designed to assist with scheduling, productivity, and test execution workflows.";
      }

      // Status / How are you
      if (msg.includes("how are you") || msg.includes("how is it going") || msg.includes("how's it going")) {
        return "I am operating at peak efficiency, thank you for asking. How is your project going, and how may I assist you today?";
      }

      // Productivity / Scheduling
      if (msg.includes("schedule") || msg.includes("calendar") || msg.includes("remind")) {
        return "You can schedule messages or calls in Blink by clicking the clock or phone icons at the top right of the chat window. Let me know if you would like me to guide you through the process.";
      }

      // Card / Studio
      if (msg.includes("card") || msg.includes("studio") || msg.includes("generator")) {
        return "The Greeting Card Studio allows you to create customized cards using AI or manual layouts. You can access it via the 'Studio' icon in the sidebar navigation.";
      }

      // Generic professional fallback
      return `Understood. I have analyzed your query: "${userMsg}". Please tell me if there's any specific action or information you require, and I'll resolve it efficiently.`;
    }
  },
  copilot: {
    name: "Blink Copilot",
    getReply: async (userMsg) => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const prompt = `You are Blink Copilot, a brilliant, professional coding assistant. The user is asking you code-related questions. Keep your reply highly helpful, technically accurate, and brief (2-3 sentences max). You can include brief Markdown code snippets.
User message: "${userMsg}"
Copilot response:`;
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              })
            }
          );
          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return reply.trim();
          }
        } catch (err) {
          console.warn("⚠️ [AI BOT] Copilot Gemini reply failed, using local rules:", err.message);
        }
      }

      const msg = userMsg.toLowerCase().trim();

      if (/^(hi|hello|hey|hola|greet|hell|he+y)/.test(msg)) {
        return "Hey there! Blink Copilot at your service. Ready to write some code, review PRs, or whiteboard architecture ideas? 🚀";
      }

      if (msg.includes("code") || msg.includes("javascript") || msg.includes("react") || msg.includes("html") || msg.includes("css")) {
        return "I love coding! For React components, make sure to keep props clean and use Hooks for state management. What project or language are you coding in right now?";
      }

      if (msg.includes("bug") || msg.includes("error") || msg.includes("broken") || msg.includes("fail")) {
        return "Debugging is half the fun. Please share the error stack trace or describe the behavior, and let's track down the root cause together.";
      }

      if (msg.includes("database") || msg.includes("prisma") || msg.includes("sql")) {
        return "Prisma is a great ORM for PostgreSQL. Make sure schemas are correctly migrated and relations are indexed. What table query are you working on?";
      }

      return "That sounds like a great engineering challenge! Tell me more about it or paste some code, and let's work on it together.";
    }
  },
  echo_bot: {
    name: "Echo Bot",
    getReply: async (userMsg) => {
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

    // Generate reply text (async)
    const replyText = await botConfig.getReply(userMessageText);

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

        // Trigger emotion classification broadcast after AI reply
        broadcastEmotionUpdate(conversationId);

        console.log(`🤖 [AI BOT] ${botUser.username} replied in conversation: ${conversationId}`);
      } catch (err) {
        console.error("❌ [AI BOT REPLY ERROR]", err);
      }
    }, 1500); // 1.5s delay to simulate typing
  } catch (err) {
    console.error("❌ [AI BOT CHECK ERROR]", err);
  }
};

/**
 * Broadcasts conversation sentiment to all online participants
 */
export const broadcastEmotionUpdate = async (conversationId) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: 15,
      include: {
        sender: {
          select: { name: true }
        }
      }
    });

    if (messages.length === 0) return;

    const formattedHistory = messages
      .reverse()
      .map((msg) => ({
        sender: msg.sender.name,
        text: msg.text
      }));

    const result = await classifyEmotion(formattedHistory);

    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId },
    });

    const broadcastPayload = {
      type: "EMOTION_UPDATE",
      payload: {
        conversationId,
        emotion: result.emotion,
        confidence: result.confidence
      }
    };

    participants.forEach((p) => {
      sendMessageToUser(p.userId, broadcastPayload);
    });

    console.log(`📡 [SOCKET EMOTION] Broadcasted emotion: ${result.emotion} (${result.confidence}) for conversation: ${conversationId}`);
  } catch (err) {
    console.error("❌ [SOCKET EMOTION BROADCAST ERROR]", err);
  }
};

