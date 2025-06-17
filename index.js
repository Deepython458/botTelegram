const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { manejarMensaje } = require('./src/comandos');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error('TELEGRAM_TOKEN no está definido');
  process.exit(1);
}

// Inicializamos el bot con polling
const bot = new TelegramBot(token, { polling: true });

const app = express();
const PORT = process.env.PORT || 3000;
const estados = {};

app.use(express.json());

// Ruta básica para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.send('Bot de Telegram funcionando con polling y Express');
});

// Escuchamos mensajes de Telegram
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text || '';

  try {
    const respuesta = await manejarMensaje(chatId.toString(), texto, estados);
    await bot.sendMessage(chatId, respuesta);
  } catch (error) {
    console.error('Error en manejarMensaje:', error);
  }
});

// Iniciamos el servidor Express para que Railway detecte el puerto
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en puerto ${PORT}`);
  console.log('Bot Telegram corriendo con polling');
});
