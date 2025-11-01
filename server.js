require('dotenv').config({ quiet: true });

const app = require('./app');
const connectDB = require('./src/config/db');

const IS_SERVERLESS = process.env.IS_SERVERLESS === "true";
let server; // To store HTTP server instance

// ====== LOCAL MODE ======
if (!IS_SERVERLESS) {
  (async () => {
    try {
      await connectDB();
      const PORT = process.env.PORT || 5000;

      server = app.listen(PORT, () => {
        console.log(`✅ Local server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error("❌ Failed to start local server:", err);
      process.exit(1);
    }
  })();

  // ✅ Graceful shutdown for local dev
  const shutdown = async (signal) => {
    console.log(`\n⚠️ Received ${signal}. Shutting down...`);
    if (server) server.close(() => console.log("✅ HTTP server closed"));

    const mongoose = require("mongoose");
    await mongoose.connection.close(false);
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}


// ====== SERVERLESS MODE (AWS Lambda) ======
if (IS_SERVERLESS) {
  const serverless = require("serverless-http");

  let isDBConnected = false;

  module.exports.handler = async (event, context) => {
    if (!isDBConnected) {
      await connectDB();
      isDBConnected = true;
      console.log("✅ MongoDB connected (Lambda)");
    }

    const handler = serverless(app);
    return handler(event, context);
  };
}
