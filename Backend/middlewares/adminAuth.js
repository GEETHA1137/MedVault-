// middlewares/adminAuth.js
const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // attach user info to req
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error("❌ Admin auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};