import { prisma } from "../config/prisma.js";
import { sendMessageToUser, clients, triggerAIReplyIfNeeded } from "../socket/socketHandler.js";
import { classifyEmotion } from "../utils/emotionClassifier.js";

export const getConversations = async (req, res) => {
  const userId = req.user.id;
  console.log(`💬 [CHAT] Fetching conversations list for user: ${userId}`);

  try {
    // Get all conversations where the user is a participant
    const participantRecords = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    });

    const conversationIds = participantRecords.map((pr) => pr.conversationId);

    // Retrieve full conversations details including the other participant and last message
    const conversations = await prisma.conversation.findMany({
      where: {
        id: { in: conversationIds },
      },
      include: {
        participants: {
          where: {
            userId: { not: userId },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedConversations = conversations.map((c) => {
      const otherParticipant = c.participants[0];
      const otherUser = otherParticipant?.user;
      const lastMsg = c.messages[0];
      const isOnline = clients.has(otherUser?.id) || ["jarvis", "copilot", "echo_bot"].includes(otherUser?.username);

      return {
        id: c.id,
        user: {
          id: otherUser?.id || "unknown",
          name: otherUser?.name || "Blink User",
          username: otherUser?.username || "blinkuser",
          status: isOnline ? "online" : "offline",
          profileImage: otherUser?.profileImage || "",
        },
        lastMessage: lastMsg ? lastMsg.text : "No messages yet",
        updatedAt: c.updatedAt.toISOString(),
        unread: 0,
      };
    });

    return res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.error("❌ [GET CONVERSATIONS ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conversations",
    });
  }
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  console.log(`💬 [CHAT] Fetching messages for conversation: ${conversationId}`);

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("❌ [GET MESSAGES ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
};

export const sendMessage = async (req, res) => {
  const { conversationId, text, recipientId } = req.body;
  const senderId = req.user.id;

  console.log(`💬 [CHAT] Sending message: senderId=${senderId}, conversationId=${conversationId || "new"}, text="${text}"`);

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Message text cannot be empty",
    });
  }

  try {
    let activeConversationId = conversationId;

    // Create a new conversation if it doesn't exist
    if (!activeConversationId && recipientId) {
      const existingParticipant = await prisma.conversationParticipant.findFirst({
        where: {
          userId: senderId,
          conversation: {
            participants: {
              some: { userId: recipientId }
            }
          }
        },
        select: { conversationId: true }
      });

      if (existingParticipant) {
        activeConversationId = existingParticipant.conversationId;
      } else {
        const newConversation = await prisma.conversation.create({
          data: {
            participants: {
              create: [
                { userId: senderId },
                { userId: recipientId }
              ]
            }
          }
        });
        activeConversationId = newConversation.id;
      }
    }

    if (!activeConversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID or Recipient ID is required",
      });
    }

    // Save message to database
    const newMessage = await prisma.message.create({
      data: {
        text,
        senderId,
        conversationId: activeConversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    // Update conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: activeConversationId },
      data: { updatedAt: new Date() },
    });

    // Get all conversation participants
    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId: activeConversationId },
    });

    // Send via WebSocket to all participants
    const broadcastPayload = {
      type: "NEW_MESSAGE",
      payload: {
        id: newMessage.id,
        conversationId: activeConversationId,
        senderId: newMessage.senderId,
        text: newMessage.text,
        createdAt: newMessage.createdAt,
        sender: newMessage.sender,
      },
    };

    participants.forEach((p) => {
      sendMessageToUser(p.userId, broadcastPayload);
    });

    // Trigger simulated AI reply if conversation contains an AI bot
    triggerAIReplyIfNeeded(activeConversationId, text, senderId);

    return res.status(201).json({
      success: true,
      message: "Message processed successfully",
      newMessage,
    });
  } catch (error) {
    console.error("❌ [SEND MESSAGE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message",
    });
  }
};

// Scheduled Message Controller Handlers
export const scheduleMessage = async (req, res) => {
  const { conversationId, text, scheduledAt } = req.body;
  const senderId = req.user.id;

  console.log(`[CHAT] Scheduling message for senderId=${senderId}, conversationId=${conversationId}, scheduledAt=${scheduledAt}`);

  if (!text || !conversationId || !scheduledAt) {
    return res.status(400).json({
      success: false,
      message: "Text, conversationId, and scheduledAt are required",
    });
  }

  try {
    const scheduledMessage = await prisma.scheduledMessage.create({
      data: {
        text,
        senderId,
        conversationId,
        scheduledAt: new Date(scheduledAt),
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

    return res.status(201).json({
      success: true,
      message: "Message scheduled successfully",
      scheduledMessage,
    });
  } catch (error) {
    console.error("❌ [SCHEDULE MESSAGE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error scheduling message",
    });
  }
};

export const getScheduledMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const scheduledMessages = await prisma.scheduledMessage.findMany({
      where: { 
        conversationId,
        isSent: false
      },
      orderBy: { scheduledAt: "asc" },
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

    return res.status(200).json({
      success: true,
      scheduledMessages,
    });
  } catch (error) {
    console.error("❌ [GET SCHEDULED MESSAGES ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving scheduled messages",
    });
  }
};

export const deleteScheduledMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.scheduledMessage.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Scheduled message cancelled successfully",
    });
  } catch (error) {
    console.error("❌ [DELETE SCHEDULED MESSAGE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting scheduled message",
    });
  }
};

// Scheduled Call Controller Handlers
export const scheduleCall = async (req, res) => {
  const { conversationId, title, callType, scheduledAt } = req.body;
  const hostId = req.user.id;

  console.log(`⏰ [CHAT] Scheduling call for hostId=${hostId}, conversationId=${conversationId}, title="${title}", scheduledAt=${scheduledAt}`);

  if (!title || !conversationId || !scheduledAt || !callType) {
    return res.status(400).json({
      success: false,
      message: "Title, conversationId, callType, and scheduledAt are required",
    });
  }

  try {
    const scheduledCall = await prisma.scheduledCall.create({
      data: {
        title,
        callType,
        hostId,
        conversationId,
        scheduledAt: new Date(scheduledAt),
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        }
      }
    });

    // Create a live post in the chat stating that a call was scheduled!
    await prisma.message.create({
      data: {
        text: `📅 Scheduled a call: "${title}" (${callType}) for ${new Date(scheduledAt).toLocaleString()}`,
        senderId: hostId,
        conversationId,
      }
    });

    // Fetch conversation participants
    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId }
    });

    // Broadcast standard NEW_MESSAGE event so it renders in participants' list
    const broadcastMessagePayload = {
      type: "NEW_MESSAGE",
      payload: {
        text: `📅 Scheduled a call: "${title}" (${callType}) for ${new Date(scheduledAt).toLocaleString()}`,
        senderId: hostId,
        conversationId,
        createdAt: new Date(),
        sender: {
          id: hostId,
          name: req.user.name,
          username: req.user.username
        }
      }
    };

    participants.forEach((p) => {
      sendMessageToUser(p.userId, broadcastMessagePayload);
    });

    return res.status(201).json({
      success: true,
      message: "Call scheduled successfully",
      scheduledCall,
    });
  } catch (error) {
    console.error("❌ [SCHEDULE CALL ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error scheduling call",
    });
  }
};

export const getScheduledCalls = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const scheduledCalls = await prisma.scheduledCall.findMany({
      where: { 
        conversationId,
        status: "SCHEDULED"
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      scheduledCalls,
    });
  } catch (error) {
    console.error("❌ [GET SCHEDULED CALLS ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving scheduled calls",
    });
  }
};

export const deleteScheduledCall = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.scheduledCall.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Scheduled call cancelled successfully",
    });
  } catch (error) {
    console.error("❌ [DELETE SCHEDULED CALL ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting scheduled call",
    });
  }
};

export const getConversationEmotion = async (req, res) => {
  const { conversationId } = req.params;
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

    if (messages.length === 0) {
      return res.status(200).json({
        success: true,
        emotion: "friendly",
        confidence: 1.0
      });
    }

    const formattedHistory = messages
      .reverse()
      .map((msg) => ({
        sender: msg.sender.name,
        text: msg.text
      }));

    const result = await classifyEmotion(formattedHistory);

    return res.status(200).json({
      success: true,
      emotion: result.emotion,
      confidence: result.confidence
    });
  } catch (error) {
    console.error("❌ [GET CONVERSATION EMOTION ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error classifying conversation emotion",
    });
  }
};


