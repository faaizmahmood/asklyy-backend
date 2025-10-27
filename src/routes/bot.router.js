const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware')
const userStatusGuard = require('../middleware/userStatus.middleware')
const botAccessGuard = require('../middleware/botAccessGuard.middleware')
const { createChatbot } = require('../controllers/chatbotController.js/createBot.controller');
const { getUserChatbots } = require('../controllers/chatbotController.js/getUserBots.controller');
const { toggleBlockBot } = require('../controllers/chatbotController.js/botAction.controller');
const { deleteBot } = require('../controllers/chatbotController.js/botAction.controller');
const { cloneBot } = require('../controllers/chatbotController.js/botAction.controller');
const { resetBotStats } = require('../controllers/chatbotController.js/botAction.controller');
const { sendMessageToBot } = require('../controllers/chatbotController.js/chat.controller');
const { getBotById } = require('../controllers/chatbotController.js/getBot.controller');

router.post('/create-bot', authMiddleware, userStatusGuard, createChatbot);
router.get('/get-bots', authMiddleware, userStatusGuard, getUserChatbots);
router.patch('/:id/block', authMiddleware, userStatusGuard, toggleBlockBot);
router.patch('/:id/reset', authMiddleware, userStatusGuard, resetBotStats);
router.post('/:id/clone', authMiddleware, userStatusGuard, cloneBot);
router.delete('/delete/:id', authMiddleware, userStatusGuard, deleteBot);
router.get('/:id', getBotById);
router.post('/message/:id', botAccessGuard, sendMessageToBot);

module.exports = router;
