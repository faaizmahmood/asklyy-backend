// controllers/chatController.js
const Bot = require("../../models/bot.model");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

const sendMessageToBot = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // 1️⃣ Find the bot
    const bot = await Bot.findById(id);
    if (!bot) return res.status(404).json({ error: "Bot not found" });

    // 2️⃣ Build the prompt using bot data
    const prompt = `
You are a chatbot named "${bot.name}" for organization "${bot.organization}".
Your persona: ${bot.persona}
Tone: ${bot.tone}
Target Audience: ${bot.targetAudience}

Knowledge Base:
${bot.entries.map((qa, i) => `${i + 1}. Q: ${qa.question}\n   A: ${qa.answer}`).join("\n")}

If the answer is not in your knowledge base, reply politely with the fallback message:
"${bot.fallbackReply}"

User says: ${message}
    `;

    // 3️⃣ Call Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 4️⃣ Extract the model’s text
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || bot.fallbackReply;

    // 5️⃣ (Optional) Save conversation in DB
    // await Chat.create({ botId: id, userMessage: message, botReply: reply });

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { sendMessageToBot }