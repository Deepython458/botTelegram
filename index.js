const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { manejarMensaje } = require('./src/comandos');

const token = '8128755134:AAHmOGjurcruxuHxBiJXACxBHB-43znOzlw';
const bot = new TelegramBot(token, { polling: true });


const estados = {};


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (!texto) return;

  try {
    const respuesta = await manejarMensaje(chatId, texto, estados);
    bot.sendMessage(chatId, respuesta, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error manejando mensaje:', error);
    bot.sendMessage(chatId, '❌ Ocurrió un error. Intenta de nuevo.');
  }
});


const app = express();
app.get('/', (req, res) => {
  res.send('Bot de Telegram corriendo 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

