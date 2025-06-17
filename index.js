const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { manejarMensaje } = require('./src/comandos');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error('Error: TELEGRAM_TOKEN no está definido en las variables de entorno');
  process.exit(1);
}

const bot = new TelegramBot(token);
const app = express();
const PORT = process.env.PORT || 3000;
const estados = {};

app.use(express.json());

// Ruta webhook para recibir mensajes desde Telegram
app.post(`/bot${token}`, async (req, res) => {
  const mensaje = req.body.message;
  if (!mensaje) return res.sendStatus(200);

  const chatId = mensaje.chat.id;
  const texto = mensaje.text || '';

  try {
    const respuesta = await manejarMensaje(chatId.toString(), texto, estados);
    await bot.sendMessage(chatId, respuesta);
  } catch (err) {
    console.error('Error manejando mensaje:', err);
  }

  res.sendStatus(200);
});

app.listen(PORT, async () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);

  const URL = process.env.URL_PUBLICA;
  if (!URL) {
    console.error('Error: URL_PUBLICA no está definido en las variables de entorno');
    process.exit(1);
  }

  try {
    await bot.setWebHook(`${URL}/bot${token}`);
    console.log(`Webhook configurado en ${URL}/bot${token}`);
  } catch (err) {
    console.error('Error configurando webhook:', err);
  }
});
