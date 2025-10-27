// controllers/chatbot/getUserChatbots.controller.js

const Chatbot = require("../../models/bot.model");

const getUserChatbots = async (req, res) => {
    try {
        const userId = req.user.id;

        const bots = await Chatbot.find({ createdBy: userId, status: { $ne: "deleted" }, })
            .select("botId name purpose organization targetAudience persona tone entries status createdAt");

        if (!bots || bots.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No chatbots found",
                data: [],
            });
        }

        // Format response
        const formattedBots = bots.map(bot => ({
            id: bot._id,
            botId: bot.botId,
            name: bot.name,
            purpose: bot.purpose,
            organization: bot.organization,
            targetAudience: bot.targetAudience,
            persona: bot.persona,
            tone: bot.tone,
            entriesCount: bot.entries?.length || 0,
            status: bot.status,
            createdAt: bot.createdAt,
        }));

        res.status(200).json({
            success: true,
            data: formattedBots,
        });
    } catch (error) {
        console.error("Get User Chatbots Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getUserChatbots };
