// middleware/authMiddleware.js
// TODO: Implement JWT authorization and user queries from database

export const protect = async (req, res, next) => {
  let token;

  // Mock token retrieval from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(`🔐 [MIDDLEWARE] Verifying authorization token: ${token.substring(0, 10)}...`);

      // Mock setting req.user details
      req.user = {
        id: "usr-1",
        name: "Vartika Sharma",
        username: "vartikasharma",
        email: "vartika@blink.app",
      };

      return next();
    } catch (error) {
      console.error("❌ [MIDDLEWARE] Auth failed:", error.message);
      return res.status(410).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.warn("⚠️ [MIDDLEWARE] Blocked unauthorized request attempt");
    // For demo purposes, we can bypass or return unauthorized. Let's return unauthorized.
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};
