// controllers/chatController.js
// TODO: Connect database queries to retrieve messages and conversation lists

export const getConversations = async (req, res) => {
  console.log("💬 [CHAT] Fetching user conversations list");

  const mockConversations = [
    {
      id: "chat-1",
      user: { id: "usr-2", name: "Leo Messi", username: "leomessi", status: "online" },
      lastMessage: "The card was perfect! Thanks Vartika.",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "chat-2",
      user: { id: "usr-3", name: "Taylor Swift", username: "taylorswift", status: "away" },
      lastMessage: "Can we collaborate on the next card theme?",
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ];

  return res.status(200).json({
    success: true,
    conversations: mockConversations,
  });
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  console.log(`💬 [CHAT] Fetching messages for conversation: ${conversationId}`);

  const mockMessages = [
    {
      id: "msg-1",
      senderId: "usr-2",
      text: "Hey! Have you tried the AI Greeting Card generator on Blink yet?",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "msg-2",
      senderId: "usr-1", // Logged in user
      text: "Yes! Made a retro cyberpunk card for Leo's birthday. It looks amazing! 🚀",
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
      id: "msg-3",
      senderId: "usr-2",
      text: "The card was perfect! Thanks Vartika.",
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
  ];

  return res.status(200).json({
    success: true,
    messages: mockMessages,
  });
};

export const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  console.log(`💬 [CHAT] Sending message to conversation ${conversationId}: "${text}"`);

  return res.status(201).json({
    success: true,
    message: "Message processed successfully (mock)",
    newMessage: {
      id: "msg-" + Math.floor(Math.random() * 1000),
      senderId: req.user?.id || "usr-1",
      text: text,
      createdAt: new Date().toISOString(),
    },
  });
};
