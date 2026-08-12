// controllers/userController.js
import { prisma } from "../config/prisma.js";

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const targetId = userId || req.user?.id;
  console.log(`🔍 [USER] Fetching profile details for ID: ${targetId}`);

  if (!targetId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        profileImage: true,
        _count: {
          select: {
            messages: true,
            participants: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatar: user.profileImage || "",
        stats: {
          friends: user._count.participants,
          cardsCreated: 0,
          messages: user._count.messages,
        },
      },
    });
  } catch (error) {
    console.error("❌ [GET USER PROFILE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user profile",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const { name, bio, username, profileImage } = req.body;
  const userId = req.user.id;
  console.log(`📝 [USER] Profile update request received for user: ${userId}`);

  try {
    // Validate username uniqueness if changed
    if (username && username !== req.user.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username },
      });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken",
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        bio: bio !== undefined ? bio : undefined,
        username: username || undefined,
        profileImage: profileImage !== undefined ? profileImage : undefined,
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        profileImage: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage || "",
        avatar: updatedUser.profileImage || "",
      },
    });
  } catch (error) {
    console.error("❌ [UPDATE USER PROFILE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error updating user profile",
    });
  }
};

export const searchUsers = async (req, res) => {
  const { q } = req.query;
  const searchPattern = q || "";
  console.log(`🔍 [USER] User search query: "${searchPattern}"`);

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: { not: req.user.id },
          },
          {
            OR: [
              { name: { contains: searchPattern, mode: "insensitive" } },
              { username: { contains: searchPattern, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        profileImage: true,
      },
      take: 10,
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("❌ [SEARCH USERS ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error searching users",
    });
  }
};

export const getUserActivities = async (req, res) => {
  const userId = req.user.id;
  console.log(`🔍 [USER] Fetching activities for user: ${userId}`);

  try {
    const activities = [];

    // 1. Get user signup activity
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    });
    if (user) {
      activities.push({
        id: "act-signup",
        type: "signup",
        title: "Joined Blink Chat App",
        description: `Welcome to Blink! Your account was created successfully.`,
        timestamp: user.createdAt,
      });
    }

    // 2. Get last 3 conversations started/joined
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, username: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
    });

    conversations.forEach((conv) => {
      const otherParticipant = conv.participants.find((p) => p.userId !== userId);
      if (otherParticipant) {
        activities.push({
          id: `act-conv-${conv.id}`,
          type: "conversation",
          title: `Started chat with ${otherParticipant.user.name}`,
          description: `Established a new conversation channel under @${otherParticipant.user.username}.`,
          timestamp: conv.createdAt,
        });
      }
    });

    // 3. Get last 3 messages sent
    const lastMessages = await prisma.message.findMany({
      where: { senderId: userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    lastMessages.forEach((msg) => {
      const otherParticipant = msg.conversation.participants.find((p) => p.userId !== userId);
      const recipientName = otherParticipant ? otherParticipant.user.name : "chat";
      activities.push({
        id: `act-msg-${msg.id}`,
        type: "message",
        title: `Sent message to ${recipientName}`,
        description: `"${msg.text.length > 40 ? msg.text.substring(0, 40) + '...' : msg.text}"`,
        timestamp: msg.createdAt,
      });
    });

    // Sort activities by timestamp desc
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      success: true,
      activities: activities.slice(0, 5), // return top 5
    });
  } catch (error) {
    console.error("❌ [GET USER ACTIVITIES ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user activities",
    });
  }
};
