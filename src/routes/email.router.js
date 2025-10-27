const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware')
const userStatusGuard = require('../middleware/userStatus.middleware')
const { sendVerificationEmail } = require('../controllers/emailController/verificationEmail.controller');
const { verifyEmail } = require('../controllers/emailController/verify.controller');
const { requestPasswordReset } = require('../controllers/emailController/requestPasswordReset.controller');

const { resetLimiter } = require('../middleware/rateLimit.middleware');

router.post('/verification-mail', authMiddleware, userStatusGuard, sendVerificationEmail);
router.get('/verify-email/:token', authMiddleware, verifyEmail);
router.post('/request-password-reset', resetLimiter, requestPasswordReset);

module.exports = router;
