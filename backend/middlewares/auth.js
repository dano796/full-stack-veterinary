const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.session = { user: { userId: data.userId, email: data.email } };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = authenticateToken;
