import { prisma } from "../config/prisma.js";
import { sendMessageToUser } from "../socket/socketHandler.js";

export const initScheduler = () => {
  console.log("[SCHEDULER] Background daemon initialized (10s intervals)");

  setInterval(async () => {
    try {
      const now = new Date();

      const scheduledMessages = await prisma.scheduledMessage.findMany({
        where: {
          scheduledAt: { lte: now },
          isSent: false
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

      if (scheduledMessages.length > 0) {
        console.log(`[SCHEDULER] Found ${scheduledMessages.length} pending messages to dispatch`);
      }

      for (const sm of scheduledMessages) {
        const newMessage = await prisma.message.create({
          data: {
            text: sm.text,
            senderId: sm.senderId,
            conversationId: sm.conversationId,
            createdAt: sm.scheduledAt,
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

        // Update conversation updatedAt
        await prisma.conversation.update({
          where: { id: sm.conversationId },
          data: { updatedAt: new Date() }
        });

        // Fetch conversation participants
        const participants = await prisma.conversationParticipant.findMany({
          where: { conversationId: sm.conversationId }
        });

        // Broadcast to participants
        const broadcastPayload = {
          type: "NEW_MESSAGE",
          payload: {
            id: newMessage.id,
            conversationId: sm.conversationId,
            senderId: newMessage.senderId,
            text: newMessage.text,
            createdAt: newMessage.createdAt,
            sender: newMessage.sender,
          }
        };

        participants.forEach((p) => {
          sendMessageToUser(p.userId, broadcastPayload);
        });

        // Delete from scheduled list
        await prisma.scheduledMessage.delete({
          where: { id: sm.id }
        });
      }

      // Process Scheduled Calls
      const scheduledCalls = await prisma.scheduledCall.findMany({
        where: {
          scheduledAt: { lte: now },
          status: "SCHEDULED"
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

      if (scheduledCalls.length > 0) {
        console.log(`[SCHEDULER] Found ${scheduledCalls.length} pending calls to activate`);
      }

      for (const sc of scheduledCalls) {
        // Update status to STARTED
        await prisma.scheduledCall.update({
          where: { id: sc.id },
          data: { status: "STARTED" }
        });

        // Create a system message in the chat
        const systemMessage = await prisma.message.create({
          data: {
            text: `📞 Call: "${sc.title}" (${sc.callType}) has started! Click Join Call above or use the invite.`,
            senderId: sc.hostId,
            conversationId: sc.conversationId,
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

        // Update conversation
        await prisma.conversation.update({
          where: { id: sc.conversationId },
          data: { updatedAt: new Date() }
        });

        // Fetch participants
        const participants = await prisma.conversationParticipant.findMany({
          where: { conversationId: sc.conversationId }
        });

        // Broadcast standard NEW_MESSAGE event
        const broadcastMessagePayload = {
          type: "NEW_MESSAGE",
          payload: {
            id: systemMessage.id,
            conversationId: sc.conversationId,
            senderId: systemMessage.senderId,
            text: systemMessage.text,
            createdAt: systemMessage.createdAt,
            sender: systemMessage.sender,
            isCallInvite: true,
            callId: sc.id,
            callType: sc.callType,
            callTitle: sc.title
          }
        };

        // Broadcast custom CALL_STARTED event to trigger live ringing/join popups
        const broadcastCallPayload = {
          type: "CALL_STARTED",
          payload: {
            id: sc.id,
            title: sc.title,
            callType: sc.callType,
            conversationId: sc.conversationId,
            hostName: sc.host.name
          }
        };

        participants.forEach((p) => {
          sendMessageToUser(p.userId, broadcastMessagePayload);
          if (p.userId !== sc.hostId) {
            sendMessageToUser(p.userId, broadcastCallPayload);
          }
        });
      }

    } catch (err) {
      console.error("[SCHEDULER TICK ERROR]", err);
    }
  }, 10000); // 10s tick
};
