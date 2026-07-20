const { Telegraf } = require('telegraf');
const axios = require('axios');
const Jimp = require('jimp');

// Берем токен из переменных окружения сервера (для безопасности)
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("ОШИБКА: Не задан BOT_TOKEN!");
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('🎰 Привет! Отправь мне фото, и я обработаю его случайным эффектом!'));

bot.on('photo', async (ctx) => {
    try {
        await ctx.reply('🎲 Рулетка крутится... Применяем случайный эффект!');
        
        const fileId = ctx.message.photo.pop().file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);

        // Скачиваем фото
        const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        let image = await Jimp.read(response.data);

        // Уменьшаем для быстроты обработки
        if (image.bitmap.width > 1200) {
            image.resize(1200, Jimp.AUTO);
        }

        // Логика рулетки: выбираем случайный эффект
        const effects = ['sepia', 'invert', 'blur', 'greyscale', 'posterize'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        let effectName = '';

        switch (randomEffect) {
            case 'sepia':
                image.sepia();
                effectName = '🟤 Сепия';
                break;
            case 'invert':
                image.invert();
                effectName = '🔲 Инверсия';
                break;
            case 'blur':
                image.blur(6);
                effectName = '🌫️ Размытие';
                break;
            case 'greyscale':
                image.greyscale();
                effectName = '⚪ Чёрно-белое';
                break;
            case 'posterize':
                image.posterize(4);
                effectName = '🎨 Постеризация (Арт)';
                break;
        }

        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        // Отправляем обратно в Telegram
        await ctx.replyWithPhoto(
            { source: buffer },
            { caption: `✨ Выпал эффект: ${effectName}` }
        );

    } catch (e) {
        console.error('Ошибка обработки:', e);
        ctx.reply('❌ Произошла ошибка при обработке фото.');
    }
});

bot.launch();
console.log('🚀 Бот-рулетка успешно запущен на сервере!');

// Корректная остановка бота при перезагрузке сервера
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const http = require('http');
http.createServer((req, res) => {
  res.write('Bot is running!');
  res.end();
}).listen(process.env.PORT || 3000);
