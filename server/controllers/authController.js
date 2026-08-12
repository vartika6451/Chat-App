// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all registration fields",
    });
  }

  console.log(`👤 [AUTH] Register request for: ${email}`);

  try {
    // Check if user already exists by email or username
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT
    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    console.error("❌ [AUTH REGISTER ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
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

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    console.error("❌ [AUTH LOGIN ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
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

export const googleAuthUser = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: "Google ID Token is required",
    });
  }

  try {
    // 1. Verify token with Google API
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!googleRes.ok) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google ID Token",
      });
    }

    const payload = await googleRes.json();
    const { email, name, picture, sub } = payload;

    // Verify audience matches if Client ID is configured
    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({
        success: false,
        message: "Google Client ID mismatch",
      });
    }

    // 2. Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a unique username using part of the email or random characters
      const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      let username = baseUsername;
      let suffix = 1;
      
      while (true) {
        const existing = await prisma.user.findFirst({
          where: { username },
        });
        if (!existing) break;
        username = `${baseUsername}${suffix}`;
        suffix++;
      }

      // Create new user (using sub as a mock password or random string since it's Google Auth)
      const hashedPassword = await bcrypt.hash(sub || Math.random().toString(36), 10);
      user = await prisma.user.create({
        data: {
          name: name || "Google User",
          username,
          email,
          password: hashedPassword,
        },
      });
      console.log(`👤 [AUTH] Created new Google User: ${email}`);
    } else {
      console.log(`👤 [AUTH] Logged in existing Google User: ${email}`);
    }

    // 3. Generate token
    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    console.error("❌ [AUTH GOOGLE ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Error authenticating with Google",
    });
  }
};
