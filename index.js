const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { manejarMensaje } = require('./src/comandos');

const token = '8128755134:AAHmOGjurcruxuHxBiJXACxBHB-43znOzlw'; // prueba
const app = express();
app.use(bodyParser.json());

// URL pública de Render (ajustá TU_APP por el nombre real de tu servicio)
const WEBHOOK_URL = `https://bottelegram.onrender.com/8128755134:AAHmOGjurcruxuHxBiJXACxBHB-43znOzlw`;

// Inicializamos el bot en modo webhook
const bot = new TelegramBot(token);
bot.setWebHook(WEBHOOK_URL);

// Endpoint que recibe actualizaciones de Telegram
app.post(`/${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Manejo de mensajes (usa tu función de src/comandos.js)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text || '';

  if (!global.estados) global.estados = {}; // estado en memoria
  const respuesta = await manejarMensaje(chatId.toString(), texto, global.estados);

  if (respuesta) {
    bot.sendMessage(chatId, respuesta);
  }
});

// Render necesita escuchar en un puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
