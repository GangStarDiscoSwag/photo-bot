const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

// Токен и URL твоего приложения
const BOT_TOKEN = process.env.BOT_TOKEN || '8230583476:AAFPHlyxmMxDac3hg80hyHpEBwWV8BKHZnS';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://photo-roulette-bot.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Отдаем файлы WebApp
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Кнопка запуска в Telegram
bot.start((ctx) => {
    ctx.reply('🎰 Привет! Это «Выпадайло» — первая рулетка эффектов для твоих фото. Загрузи снимок, закрути барабан и забери свой уникальный стиль!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📸 Открыть Выпадайло", web_app: { url: WEBAPP_URL } }]
            ]
        }
    });
});

// Запуск сервера для Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

bot.launch().then(() => {
    console.log('🤖 Бот успешно запущен и готов к работе!');
}).catch((err) => {
    console.error('Ошибка запуска Telegram бота:', err);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
