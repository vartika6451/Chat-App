// controllers/userController.js
// TODO: Connect database queries to retrieve profiles and search list

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  console.log(`🔍 [USER] Fetching profile details for ID: ${userId}`);

  return res.status(200).json({
    success: true,
    user: {
      id: userId || "usr-1",
      name: "Vartika Sharma",
      username: "vartikasharma",
      bio: "Creating beautiful pixels and code.",
      avatar: "",
      stats: {
        friends: 42,
        cardsCreated: 12,
        messages: 1337,
      },
    },
  });
};

export const updateUserProfile = async (req, res) => {
  const { name, bio, username } = req.body;
  console.log("📝 [USER] Profile update request received");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: req.user?.id || "usr-1",
      name: name || "Vartika Sharma",
      username: username || "vartikasharma",
      bio: bio || "Creating beautiful pixels and code.",
      avatar: "",
    },
  });
};

export const searchUsers = async (req, res) => {
  const { q } = req.query;
  console.log(`🔍 [USER] User search query: "${q || ""}"`);

  const mockUsers = [
    { id: "usr-1", name: "Leo Messi", username: "leomessi" },
    { id: "usr-2", name: "Taylor Swift", username: "taylorswift" },
    { id: "usr-3", name: "Sam Altman", username: "samaltman" },
    { id: "usr-4", name: "Elon Musk", username: "elonmusk" },
  ];

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes((q || "").toLowerCase()) ||
      u.username.toLowerCase().includes((q || "").toLowerCase())
  );

  return res.status(200).json({
    success: true,
    users: filtered,
  });
};
