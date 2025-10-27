// controllers/botController.js
const Bot = require("../../models/bot.model");

// @desc Get a bot by ID
// @route GET /api/bot/:id
// @access Public (for widget)
getBotById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid bot ID format" });
    }

    const bot = await Bot.findById(id);

    if (!bot) {
      return res.status(404).json({ success: false, message: "Bot not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: bot._id,
        name: bot.name,
        purpose: bot.purpose,
        organization: bot.organization,
        tone: bot.tone,
        persona: bot.persona,
        targetAudience: bot.targetAudience,
      },
    });
  } catch (err) {
    console.error("Error fetching bot:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { getBotById };