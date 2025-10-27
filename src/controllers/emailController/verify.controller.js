const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const dotenv = require("dotenv");
dotenv.config();

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ success: false, message: "Verification token is missing." });
    }

    try {
        // Verify token using the same secret used when sending email
        const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.verified) {
            return res.status(200).json({ success: true, message: "Email is already verified." });
        }

        // Mark user as verified
        user.verified = true;
        await user.save();

        return res.status(200).json({ success: true, message: "Email successfully verified." });
    } catch (err) {
        console.error("Email verification error:", err);

        // Handle JWT expired or invalid separately
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ success: false, message: "Verification link has expired." });
        }

        return res.status(400).json({ success: false, message: "Invalid verification link." });
    }
};

module.exports = { verifyEmail };
