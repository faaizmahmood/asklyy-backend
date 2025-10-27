const Chatbot = require("../../models/bot.model"); // <-- your new model
const crypto = require("crypto");

// Helper to generate botId like "BOT-5F3A2C"
const generateBotId = () => "BOT-" + crypto.randomBytes(3).toString("hex").toUpperCase();

const createChatbot = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you're using auth middleware

        const {
            name,
            purpose,
            organization,
            targetAudience,
            persona,
            tone,
            entries,
            fallbackReply
        } = req.body;

        // con

        // Validate required fields manually (though Mongoose will also validate)
        if (!name || !purpose || !tone || !entries || entries.length === 0) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const botId = generateBotId();

        const newChatbot = await Chatbot.create({
            botId,
            name,
            purpose,
            organization,
            targetAudience,
            persona,
            tone,
            entries,
            createdBy: userId,
            fallbackReply
        });

        res.status(201).json({
            success: true,
            message: "Chatbot created successfully",
            data: {
                id: newChatbot._id,
                botId: newChatbot.botId,
                name: newChatbot.name,
                tone: newChatbot.tone,
                entriesCount: newChatbot.entries.length,
                status: newChatbot.status,
            },
        });

    } catch (error) {
        console.error("Create Chatbot Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { createChatbot };
