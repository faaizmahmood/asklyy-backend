const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;
    if (!mongoURL) {
      throw new Error("MONGO_URL is missing in environment variables");
    }

    await mongoose.connect(mongoURL);

    console.log('✅ MongoDB Connected...');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw error; // Re-throw so server.js knows
  }
};

module.exports = connectDB;
