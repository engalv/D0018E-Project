const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "supersecretkey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.Is_Admin) return res.status(403).json({ error: "Forbidden" });
  next();
}

module.exports = { authenticate, requireAdmin };

