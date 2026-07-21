const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN || 'ТВОЙ_ТОКЕН_БОТА';
const RENDER_URL = 'https://photo-roulette-bot.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

bot.start((ctx) => {
  ctx.reply('Добро пожаловать в Выпадайло! 🎲\nНажми кнопку ниже, чтобы испытать удачу:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🎰 Открыть Рулетку',
            web_app: { url: RENDER_URL }
          }
        ]
      ]
    }
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
