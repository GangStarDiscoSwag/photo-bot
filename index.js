const { Telegraf } = require('telegraf');
const express = require('express');

// Вставь сюда свой токен от @BotFather и ссылку на Render
const BOT_TOKEN = process.env.BOT_TOKEN || '8230583476:AAFPHlyxmMxDac3hg80hyHpEBwWV8BKHZns';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://photo-bot-xxxx.onrender.com';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Отдаем файлы WebApp (index.html, стили, скрипты)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.send('Выпадайло Bot & WebApp запущены и работают!');
});

// Обработка команды /start
bot.start((ctx) => {
    ctx.reply('🎰 Привет! Это «Выпадайло» — первая рулетка эффектов для твоих фото. Загрузи снимок, закрути барабан и забери свой уникальный стиль!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📸 Открыть Выпадайло", web_app: { url: WEBAPP_URL } }]
            ]
        }
    });
});

// Запуск веб-сервера для Render
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

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
