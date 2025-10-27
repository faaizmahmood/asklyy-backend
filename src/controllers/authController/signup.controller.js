const User = require('../../models/user.model');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt.util');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    const { fullName, email, password, phone } = req.body;

    if (!email || !password || !fullName || !phone) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // ✅ Hash password before saving (if not handled in model pre-save hook)
        const hashedPassword = await bcrypt.hash(password, 10);

        const userPayload = {
            name: fullName,
            email,
            password: hashedPassword,
            phone,
            verified: false,
        };

        const user = new User(userPayload);
        await user.save();

        const tokenPayload = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        // ✅ Generate tokens
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // ✅ Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: "Signup successful.",
            accessToken,
            userId: user._id,
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

module.exports = { signup };
