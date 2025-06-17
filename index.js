const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { manejarMensaje } = require('./src/comandos');

const token = process.env.TELEGRAM_TOKEN || 'TU_TOKEN_ACÁ';
const URL = process.env.URL_PUBLICA || 'https://TU-PROYECTO.up.railway.app';

const bot = new TelegramBot(token, { webHook: { port: 3000 } });
const app = express();
app.use(express.json());

const estados = {};

app.post(`/bot${token}`, async (req, res) => {
  const mensaje = req.body.message;
  if (!mensaje) return res.sendStatus(200);

  const chatId = mensaje.chat.id;
  const texto = mensaje.text || '';

  try {
    const respuesta = await manejarMensaje(chatId.toString(), texto, estados);
    await bot.sendMessage(chatId, respuesta);
  } catch (err) {
    console.error('Error al manejar mensaje:', err);
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Bot de Telegram activo por webhook ✅');
});

app.listen(3000, async () => {
  console.log('Servidor Express corriendo en el puerto 3000');

  try {
    await bot.setWebHook(`${URL}/bot${token}`);
    console.log(`Webhook configurado en ${URL}/bot${token}`);
  } catch (error) {
    console.error('Error configurando webhook:', error.message);
  }
});

