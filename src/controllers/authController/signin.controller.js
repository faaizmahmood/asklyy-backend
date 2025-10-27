const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt.util');
const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No account found with this email." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password." });

        const tokenPayload = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Store refresh token in HTTP-Only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful.",
            accessToken, // frontend will use this
            userId: user._id,
        });

    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

module.exports = { signin };
