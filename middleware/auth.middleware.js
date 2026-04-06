const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user from DB
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Check if banned / disabled
    if (user.status !== "active") {
      return res.status(403).json({
        message: "Account is disabled"
      });
    }

    // ✅ Attach fresh user (not just token)
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();

  } catch (error) {

    return res.status(401).json({ message: "Invalid token" });

  }

};