const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const StatsSchema = new mongoose.Schema(
  {
    totalMessages: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    positiveFeedback: { type: Number, default: 0 },
    negativeFeedback: { type: Number, default: 0 },
    lastActive: { type: Date, default: null },
  },
  { _id: false }
);

const ChatbotSchema = new mongoose.Schema(
  {
    botId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      default: "",
    },
    targetAudience: {
      type: String,
      default: "",
    },
    persona: {
      type: String,
      default: "",
    },
    fallbackReply: {
      type: String,
      default: "",
    },
    tone: {
      type: String,
      enum: ["friendly", "formal", "casual"],
      required: true,
    },
    entries: {
      type: [EntrySchema],
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 20,
        message: "Entries must be between 1 and 20.",
      },
    },

    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },

    // 📊 Stats Section
    stats: {
      type: StatsSchema,
      default: () => ({}),
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chatbot", ChatbotSchema);
