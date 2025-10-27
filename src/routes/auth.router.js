const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController/signup.controller');
const { signin } = require('../controllers/authController/signin.controller');
const { refreshToken } = require('../controllers/authController/refresh.controller');
const { logout } = require('../controllers/authController/logout.controller');
const { resetPassword } = require('../controllers/authController/resetPassword.controller');

const { authLimiter, resetLimiter } = require('../middleware/rateLimit.middleware');


router.post('/signup', signup);
router.post('/signin', authLimiter, signin);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/reset-password', resetLimiter, resetPassword);

module.exports = router;
