const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

// Укажи здесь твой токен от @BotFather и URL от Render
const BOT_TOKEN = process.env.BOT_TOKEN || '8230583476:AAFPHlyxmMxDac3hg80hyHpEBwWV8BKHZns';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://photo-bot-xxxx.onrender.com'; 

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Отдаем текущую папку со всеми файлами (включая index.html)
app.use(express.static(__dirname));

// При обращении к корню отдаем напрямую файл index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Кнопка запуска в Telegram
bot.start((ctx) => {
    ctx.reply('🎰 Привет! Это «Выпадайло» — рулетка эффектов для твоих фото. Загрузи снимок, закрути барабан и забери свой уникальный стиль!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📸 Открыть Выпадайло", web_app: { url: WEBAPP_URL } }]
            ]
        }
    });
});

// Сервер Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

bot.launch().then(() => {
    console.log('🤖 Бот успешно подключен!');
}).catch((err) => {
    console.error('Ошибка запуска бота:', err);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
