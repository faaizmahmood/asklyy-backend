const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const emailRouter = require('./email.router');
const botRouter = require('./bot.router');

// This centralizes route mounting
module.exports = function registerRoutes(app) {
  app.use('/api/user', userRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/email', emailRouter);
  app.use('/api/bot', botRouter);
};
