const User = require('../../models/user.model'); 

const getUserProfile = async (req, res) => { 
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password'); // exclude password

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                verified: user.verified,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getUserProfile };
