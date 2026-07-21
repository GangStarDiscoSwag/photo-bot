const { Telegraf } = require('telegraf');
const express = require('express');

// Забираем токен из переменных окружения Render или вставляем напрямую
const BOT_TOKEN = process.env.BOT_TOKEN || '8230583476:AAFPHlyxmMxDac3hg80hyHpEBwWV8BKHZns';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://photo-bot-xxxx.onrender.com'; // Твоя ссылка на Render

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Отдаем статические файлы (index.html и ресурсы)
app.use(express.static(__dirname));

// Простой маршрут для проверки работы и пинга
app.get('/', (req, res) => {
    res.send('Выпадайло Bot & WebApp запущены и работают 24/7! 🚀');
});

// Ответ бота на /start
bot.start((ctx) => {
    ctx.reply('🎰 Привет! Это «Выпадайло» — рулетка эффектов для твоих фото.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📸 Открыть Выпадайло", web_app: { url: WEBAPP_URL } }]
            ]
        }
    });
});

// Запуск веб-сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

// Запуск бота
bot.launch().then(() => {
    console.log('🤖 Бот успешно подключен к Telegram!');
}).catch((err) => {
    console.error('Ошибка запуска бота:', err);
});

// Корректная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
