// controllers/authController.js
// TODO: Connect database queries and bcrypt password matching

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all registration fields",
    });
  }

  console.log(`👤 [AUTH] Register request for: ${email}`);

  // Return mock successful signup payload
  return res.status(201).json({
    success: true,
    message: "Registration completed successfully",
    user: {
      id: "usr-" + Math.floor(Math.random() * 100),
      name,
      username,
      email,
      bio: "Hey there! I am using Blink.",
    },
    token: "mock-jwt-token-xyz-123",
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  console.log(`👤 [AUTH] Login request for: ${email}`);

  // Return mock successful login payload
  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: "usr-1",
      name: "Vartika Sharma",
      username: "vartikasharma",
      email: email,
      bio: "Creating beautiful pixels and code.",
    },
    token: "mock-jwt-token-xyz-123",
  });
};

export const logoutUser = async (req, res) => {
  console.log("👤 [AUTH] Logout request initiated");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getCurrentUser = async (req, res) => {
  console.log("👤 [AUTH] Querying current active session");
  return res.status(200).json({
    success: true,
    user: req.user, // Set by authMiddleware protect
  });
};
