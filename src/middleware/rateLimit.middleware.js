const rateLimit = require("express-rate-limit");

// General function to create a customizable rate limiter
const createRateLimiter = ({ windowMs, max, message }) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific limiter for auth/login
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many login attempts from this IP, please try again later.",
});

// Password reset limiter
const resetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many password reset attempts. Please try again later.",
});

module.exports = { authLimiter, resetLimiter };
