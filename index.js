const { Telegraf } = require('telegraf');
const express = require('express');

// 1. Инициализация Telegram-бота
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Привет! Я готов к работе.'));

bot.on('photo', async (ctx) => {
  try {
    await ctx.reply('Фото получено в Telegram!');
  } catch (error) {
    console.error('Ошибка в боте:', error);
  }
});

bot.launch();

// 2. Инициализация Веб-Сервера для связи с сайтом (index.html)
const app = express();

// Разрешаем сайту делать запросы к нашему серверу (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json({ limit: '10mb' }));

// Проверка работы сервера
app.get('/', (req, res) => {
  res.send('Сервер и Бот успешно работают!');
});

// Ручка (API) для будущего приема фото из index.html
app.post('/api/process', (req, res) => {
  console.log('Получен запрос с веб-сайта!');
  res.json({ status: 'success', message: 'Картинка принята сервером' });
});

// Запуск сервера на порту Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

// Плавное выключение бота
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
