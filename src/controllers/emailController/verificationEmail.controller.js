// src/controllers/verifyEmailController/sendVerificationEmail.js
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (user.verified) return res.status(400).json({ msg: 'Already verified' });

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.EMAIL_SECRET,
            { expiresIn: '1h' }
        );

        // Build verify URL using FRONTEND_URL from env
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

        // Send basic email (no template)
        await transporter.sendMail({
            from: `"Support Team" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Verify your email',
            text: `Hi ${user.name || "User"},\n\nPlease verify your email by clicking the link below:\n${verifyUrl}\n\nThis link will expire in 1 hour.`,
            html: `
        <p>Hi ${user.name || "User"},</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
        <p>This link will expire in 1 hour.</p>

        Regards,
        Support Team
      `
        });

        res.json({ msg: 'Verification email sent successfully' });

    } catch (err) {

        console.error('Error sending verification email:', err);
        res.status(500).json({ msg: 'Failed to send verification email', error: err.message });

    }
};

module.exports = { sendVerificationEmail };
