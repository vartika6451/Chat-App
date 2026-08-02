// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(`🔐 [MIDDLEWARE] Verifying authorization token: ${token.substring(0, 10)}...`);

      // Decode JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Load user details from database (excluding password)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          bio: true,
          profileImage: true,
        },
      });

      if (!user) {
        return res.status(401).json({ success: false, message: "Not authorized, user not found" });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("❌ [MIDDLEWARE] Auth failed:", error.message);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.warn("⚠️ [MIDDLEWARE] Blocked unauthorized request attempt");
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};
