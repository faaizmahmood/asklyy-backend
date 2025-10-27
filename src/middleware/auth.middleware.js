const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_SECRET = process.env.ACCESS_SECRET; // New access token secret

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Missing or malformed Authorization header',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const user = jwt.verify(token, ACCESS_SECRET); // ✅ Only verify using access secret
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token expired' }); // 401 triggers frontend to refresh
        }
        return res.status(401).json({ message: 'Invalid access token' });
    }
};

module.exports = authMiddleware;
