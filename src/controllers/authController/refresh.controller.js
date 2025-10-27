const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../../utils/jwt.util');
require('dotenv').config();

const REFRESH_SECRET = process.env.REFRESH_SECRET;

const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(token, REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        const newAccessToken = generateAccessToken({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
};

module.exports = { refreshToken };
