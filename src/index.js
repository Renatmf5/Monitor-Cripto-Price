// src/index.js
require('dotenv').config();
const { connect } = require('./services/websocketService');
const bot = require('./services/telegramService');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'config.json');
const { getParameter } = require('./services/parameterService');


let config = require('./config.json');

let listPrice = [];
let mexcPriceORAIBuffer = undefined;
let mexcPriceOCHBuffer = undefined;
let minLimit = config.minLimit;
let maxLimit = config.maxLimit;

function resetPriceBuffers() {
  mexcPriceORAIBuffer = undefined;
  mexcPriceOCHBuffer = undefined;
}

async function addPrice(datetime) {
  const cof = mexcPriceORAIBuffer / mexcPriceOCHBuffer;
  listPrice.push({ datetime, ORAI: mexcPriceORAIBuffer, OCH: mexcPriceOCHBuffer, Cof: cof });
  console.log(`[${datetime}] Preço atual de ORAI: ${mexcPriceORAIBuffer} e OCH: ${mexcPriceOCHBuffer} e Cof: ${cof}`);
  checkCofLimits(cof);
}

function checkCofLimits(cof) {
  const TelegramChatId = getParameter('TELEGRAM_CHAT_ID');
  if (cof < minLimit || cof > maxLimit) {
    bot.sendMessage(TelegramChatId, `⚠️ Alerta: Cof fora dos limites! Valor atual: ${cof}`);
  }
}

function updateConfigFile() {
  fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error('Erro ao atualizar o arquivo config.json:', err);
    } else {
      console.log('Configurações atualizadas com sucesso no config.json');
    }
  });
}

// Funções para alterar limites via Telegram
bot.onText(/\/setminlimit (\d+(\.\d+)?)/, (msg, match) => {
  minLimit = parseFloat(match[1]);
  config.minLimit = minLimit;
  bot.sendMessage(msg.chat.id, `Novo limite mínimo definido: ${minLimit}`);
  updateConfigFile();
});

bot.onText(/\/setmaxlimit (\d+(\.\d+)?)/, (msg, match) => {
  maxLimit = parseFloat(match[1]);
  config.maxLimit = maxLimit;
  bot.sendMessage(msg.chat.id, `Novo limite máximo definido: ${maxLimit}`);
  updateConfigFile();
});

function processMessage(symbol, newPrice) {
  const now = new Date();
  const datetime = now.toISOString().replace('T', ' ').substr(0, 19);

  if (symbol === 'ORAIUSDT' && newPrice !== mexcPriceORAIBuffer) {
    mexcPriceORAIBuffer = newPrice;
    if (mexcPriceOCHBuffer !== undefined) {
      addPrice(datetime);
      resetPriceBuffers();
    }
  }

  if (symbol === 'OCHUSDT' && newPrice !== mexcPriceOCHBuffer) {
    mexcPriceOCHBuffer = newPrice;
    if (mexcPriceORAIBuffer !== undefined) {
      addPrice(datetime);
      resetPriceBuffers();
    }
  }
}

// Iniciar conexão WebSocket
connect(processMessage);
