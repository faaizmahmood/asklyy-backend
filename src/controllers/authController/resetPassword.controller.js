// src/controllers/auth/resetPassword.js
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        console.log(newPassword)
        console.log(token)

        if (!token || !newPassword) {
            return res.status(400).json({ msg: "Token and new password are required" });
        }

        // 1. Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.EMAIL_SECRET);
        } catch (err) {
            return res.status(400).json({ msg: "Invalid or expired reset token" });
        }

        // 2. Find user
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // 3. Check if new password is same as old one
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ msg: "New password must be different from the old password" });
        }

        // 4. Update user password (hash happens in pre-save middleware)
        user.password = newPassword;
        await user.save();

        // 5. Response
        res.json({ msg: "Password reset successful" });
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).json({ msg: "Failed to reset password", error: err.message });
    }
};

module.exports = { resetPassword };
