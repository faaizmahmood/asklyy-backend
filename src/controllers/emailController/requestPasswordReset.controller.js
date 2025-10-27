// src/controllers/auth/sendResetPasswordEmail.js
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // 2. Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.EMAIL_SECRET,
            { expiresIn: '15m' }
        );

        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;

        // 3. Setup Gmail transporter (Recommended way for Gmail SMTP)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // App Password (NOT your Gmail password)
            },
        });

        // 4. Prepare plain email content
        const text = `
Hello ${user.name || "User"},

You requested a password reset. Click the link below to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you didn't request this, please ignore this email.

Regards,
Support Team
`;

        // 5. Send email
        await transporter.sendMail({
            from: `"Support Team" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Reset Your Password",
            text, // Keeping it clean and simple
        });

        res.json({ msg: "Password reset email sent successfully" });
    } catch (err) {
        console.error("Error sending password reset email:", err);
        res.status(500).json({ msg: "Failed to send reset email", error: err.message });
    }
};

module.exports = { requestPasswordReset };
