const Chatbot = require("../../models/bot.model");
const crypto = require("crypto");

// Helper to generate botId like "BOT-5F3A2C"
const generateBotId = () => "BOT-" + crypto.randomBytes(3).toString("hex").toUpperCase();

/**
 * @desc Toggle block/unblock chatbot
 * @route PATCH /api/bots/:id/block
 */
const toggleBlockBot = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const bot = await Chatbot.findOne({ _id: id, createdBy: userId });
        if (!bot) return res.status(404).json({ success: false, message: "Bot not found" });

        bot.status = bot.status === "blocked" ? "active" : "blocked";
        await bot.save();

        res.status(200).json({
            success: true,
            message: bot.status === "active" ? "Bot unblocked successfully" : "Bot blocked successfully",
            data: { id: bot._id, status: bot.status },
        });
    } catch (error) {
        console.error("Toggle Block Bot Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc Delete chatbot permanently
 * @route DELETE /api/bots/:id
 */
const deleteBot = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Find bot owned by the current user
        const bot = await Chatbot.findOne({ _id: id, createdBy: userId });
        if (!bot) {
            return res.status(404).json({
                success: false,
                message: "Bot not found or already deleted",
            });
        }

        // If already marked deleted
        if (bot.status === "deleted") {
            return res.status(400).json({
                success: false,
                message: "Bot already deleted",
            });
        }

        // Soft delete (update status only)
        bot.status = "deleted";
        await bot.save();

        res.status(200).json({
            success: true,
            message: "Chatbot deleted successfully (soft delete)",
            data: { id: bot._id, name: bot.name, status: bot.status },
        });
    } catch (error) {
        console.error("Soft Delete Bot Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting bot",
        });
    }
};

/**
 * @desc Clone chatbot (duplicate with new botId)
 * @route POST /api/bots/:id/clone
 */
const cloneBot = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existingBot = await Chatbot.findOne({ _id: id, createdBy: userId });
        if (!existingBot) return res.status(404).json({ success: false, message: "Bot not found" });

        const clonedBot = await Chatbot.create({
            ...existingBot.toObject(),
            _id: undefined, // avoid duplication of Mongo _id
            botId: generateBotId(),
            name: `${existingBot.name} (Clone)`,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({
            success: true,
            message: "Chatbot cloned successfully",
            data: { id: clonedBot._id, botId: clonedBot.botId, name: clonedBot.name },
        });
    } catch (error) {
        console.error("Clone Bot Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc Reset bot stats (like message count, feedback, etc.)
 * @route PATCH /api/bots/:id/reset
 */
const resetBotStats = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const bot = await Chatbot.findOne({ _id: id, createdBy: userId });
        if (!bot) return res.status(404).json({ success: false, message: "Bot not found" });

        // Example: Reset stats fields
        bot.stats = { messageCount: 0, positiveFeedback: 0, positiveFeedback: 0, negativeFeedback: 0, lastActive: null };
        await bot.save();

        res.status(200).json({
            success: true,
            message: "Bot stats reset successfully",
            data: { id: bot._id },
        });
    } catch (error) {
        console.error("Reset Bot Stats Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = {
    toggleBlockBot,
    deleteBot,
    cloneBot,
    resetBotStats,
};
