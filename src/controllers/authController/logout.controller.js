

const logout = (req, res) => {

    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
};


module.exports = { logout }