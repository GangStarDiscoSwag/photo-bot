const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

// 1. Токен бота и имя твоего приложения на Render
const BOT_TOKEN = process.env.BOT_TOKEN || '8230583476:AAFPHlyxmMxDac3hg80hyHpEBwWV8BKHZns';
const RENDER_URL = 'https://photo-roulette-bot.onrender.com'; // Твой HTTPS URL на Render

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Раздаем статические файлы (включая index.html)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Команда /start с правильной Web App кнопкой
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

// Запуск сервера Express
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

// Запуск бота
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
