//src/services/telegramService.js
const TelegramBot = require('node-telegram-bot-api');
const { getParameter } = require('./parameterService');

const TelegramToken = getParameter('TELEGRAM_BOT_TOKEN');
const bot = new TelegramBot(TelegramToken, { polling: true });

module.exports = bot;
