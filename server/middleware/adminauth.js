const jwt = require('jsonwebtoken');
const {users, sequelize } = require('../database');
const JWT_SECRET = "abcddd443";

const authenticateTokenAndAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    const user = await users.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    console.error("Error verifying token or checking admin status:", err);
    res.status(403).json({ error: "Invalid token." });
  }
};

module.exports = authenticateTokenAndAdmin;
