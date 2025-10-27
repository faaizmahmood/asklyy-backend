require('dotenv').config({quiet: true}); // Load env first

const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();  // Ensure DB is connected before starting
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1); // Exit process if DB fails
  }
})();


// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);
  if (server) server.close(() => console.log('✅ HTTP server closed.'));
  // You might close DB connection here:
  const mongoose = require('mongoose');
  await mongoose.connection.close(false);
  console.log('✅ MongoDB connection closed.');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));