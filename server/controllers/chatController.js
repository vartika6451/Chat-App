import { prisma } from "../config/prisma.js";
import { sendMessageToUser, clients, triggerAIReplyIfNeeded } from "../socket/socketHandler.js";

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
