const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;   // new
const REFRESH_SECRET = process.env.REFRESH_SECRET; // new

const generateAccessToken = (user) => {
    return jwt.sign(user, ACCESS_SECRET, { expiresIn: '15m' }); // short-lived
}

const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' }); // long-lived
}

module.exports = { generateAccessToken, generateRefreshToken };
