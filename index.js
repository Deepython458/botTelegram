const TelegramBot = require('node-telegram-bot-api');
const { manejarMensaje } = require('./src/comandos');

const token = '8128755134:AAHmOGjurcruxuHxBiJXACxBHB-43znOzlw';  // Pon tu token aquí

// Para desarrollo local con polling
const bot = new TelegramBot(token, { polling: true });

const estados = {};

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text || '';

  const respuesta = await manejarMensaje(chatId.toString(), texto, estados);

  bot.sendMessage(chatId, respuesta);
});

console.log('Bot de Telegram corriendo...');