// middlewares/botAccessGuard.js
const Bot = require("../models/bot.model");
const User = require("../models/user.model");

const botAccessGuard = async (req, res, next) => {
  try {
    
    const { id } = req.params;

    // 1️⃣ Find the bot
    const bot = await Bot.findById(id).select("status createdBy");
    if (!bot) {
      return res.status(404).json({ message: "Chatbot not found" });
    }

    // 2️⃣ Check if chatbot is blocked or deleted
    if (bot.status === "blocked") {
      return res.status(403).json({ message: "This chatbot is temporarily blocked" });
    }

    if (bot.status === "deleted") {
      return res.status(410).json({ message: "This chatbot has been deleted" });
    }

    // 3️⃣ Check bot owner (user)
    const user = await User.findById(bot.createdBy).select("status");
    if (!user) {
      return res.status(403).json({ message: "The owner of this chatbot no longer exists" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "The chatbot's owner account is blocked" });
    }

    if (user.status === "deleted") {
      return res.status(403).json({ message: "The chatbot's owner account is deleted" });
    }

    // 4️⃣ Everything OK — pass control
    req.bot = bot;
    next();
  } catch (error) {
    console.error("Bot access guard error:", error);
    return res.status(500).json({ message: "Server error in bot access guard" });
  }
};

module.exports = botAccessGuard;
