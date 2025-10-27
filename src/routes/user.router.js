const express = require('express')
const router = express.Router()
const { getUserProfile } = require('../controllers/userController/user.controller')
const userMiddleware = require('../middleware/auth.middleware')
const userStatusGuard = require('../middleware/userStatus.middleware')


router.get('/profile', userMiddleware, userStatusGuard, getUserProfile);

module.exports = router;