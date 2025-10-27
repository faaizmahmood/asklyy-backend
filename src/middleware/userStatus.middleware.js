const { verifyUser } = require('../utils/jwt.util');
const User = require('../models/user.model')

const userStatusGuard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("status");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    if (user.status === "deleted") {
      return res.status(403).json({ message: "Your account is deleted" });
    }

    next(); // ✅ Allowed to proceed
  } catch (error) {
    return res.status(500).json({ message: "Server error in status guard" });
  }
};

module.exports = userStatusGuard;