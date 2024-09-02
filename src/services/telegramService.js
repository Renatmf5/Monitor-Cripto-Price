const TelegramBot = require('node-telegram-bot-api');
const { getParameter } = require('./parameterService');

async function createBot() {
  try {
    const TelegramToken = await getParameter('/monitor-app/TELEGRAM_BOT_TOKEN');
    const bot = new TelegramBot(TelegramToken, { polling: true });
    return bot;
  } catch (error) {
    console.error('Erro ao obter o token do Telegram:', error);
    throw error; // Re-lança o erro para ser tratado no chamador
  }
}

module.exports = { createBot };
