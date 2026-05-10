import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization);
  console.log("JWT SECRET (VERIFY):", process.env.JWT_SECRET);
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ FIXED

    req.user = { id: decoded.id};

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};