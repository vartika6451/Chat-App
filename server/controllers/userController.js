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
  const { name, bio, username } = req.body;
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
