const jwt = require("jsonwebtoken");

// This is "middleware" - a function that runs BEFORE the route handler.
// It checks the request has a valid JWT, and attaches the user id to req.user
// so route handlers know WHO is making the request.
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // attach decoded user id to the request
    next(); // move on to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
