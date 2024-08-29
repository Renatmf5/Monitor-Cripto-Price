// src/services/websocketService.js
const WebSocket = require('ws');

function connect(processMessage) {
  const ws = new WebSocket(process.env.STREAM_URL_MEXC);

  ws.on('open', () => {
    console.log('Conexão aberta com o WebSocket');
    ws.send(JSON.stringify({
      method: "SUBSCRIPTION",
      params: [
        "spot@public.deals.v3.api@ORAIUSDT",
        "spot@public.deals.v3.api@OCHUSDT"
      ]
    }));
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.c === 'spot@public.deals.v3.api@ORAIUSDT' && msg.d.deals && msg.d.deals.length > 0) {
        const newPrice = parseFloat(msg.d.deals[0].p);
        processMessage('ORAIUSDT', newPrice);
      }

      if (msg.c === 'spot@public.deals.v3.api@OCHUSDT' && msg.d.deals && msg.d.deals.length > 0) {
        const newPrice = parseFloat(msg.d.deals[0].p);
        processMessage('OCHUSDT', newPrice);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error.message);
    }
  });

  ws.on('close', (code) => {
    console.log(`Conexão fechada com o código ${code}. Reconectando em 5 segundos...`);
    setTimeout(() => connect(processMessage), 5000);
  });

  ws.on('error', (err) => {
    console.error('Erro no WebSocket:', err.message);
  });
}

module.exports = { connect };
