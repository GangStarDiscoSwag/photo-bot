const { Telegraf } = require('telegraf');
const express = require('express');
const Jimp = require('jimp');
const path = require('path');

// 1. Инициализация Telegram-бота
const bot = new Telegraf(process.env.BOT_TOKEN);

// Кнопка для запуска Mini App прямо из чата
bot.start((ctx) => {
  ctx.reply('Добро пожаловать в Выпадайло! 🎲\nНажми кнопку ниже, чтобы испытать удачу:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🎰 Открыть Рулетку',
            web_app: { url: 'https://photo-roulette-bot.onrender.com' }
          }
        ]
      ]
    }
  });
});

bot.on('photo', async (ctx) => {
  try {
    await ctx.reply('Фото получено в Telegram!');
  } catch (error) {
    console.error('Ошибка в боте:', error);
  }
});

bot.launch();

// 2. Веб-сервер Express
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Увеличиваем лимит для приема больших картинок в JSON
app.use(express.json({ limit: '15mb' }));

// Сервер отдаёт index.html прямо на главной странице https://photo-roulette-bot.onrender.com/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Основная ручка обработки фото под выбитый стиль
app.post('/api/process', async (req, res) => {
  try {
    const { image, rarity } = req.body;

    if (!image) {
      return res.status(400).json({ status: 'error', message: 'Нет изображения' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const img = await Jimp.read(buffer);

    switch (rarity) {
      case 'blue': // Обычный (Нуар)
        img.greyscale().contrast(0.3);
        break;
      case 'green': // Необычный (Сепия)
        img.sepia();
        break;
      case 'purple': // Редкий (Киберпанк)
        img.color([
          { apply: 'hue', params: [-30] },
          { apply: 'saturate', params: [20] }
        ]);
        break;
      case 'red': // Эпический (Тил-Оранж)
        img.color([
          { apply: 'spin', params: [60] },
          { apply: 'contrast', params: [20] }
        ]);
        break;
      case 'gold': // Легендарный (Золото)
        img.color([
          { apply: 'saturate', params: [40] },
          { apply: 'lighten', params: [10] }
        ]);
        break;
      case 'mythic': // Мифический (Инверсия)
        img.invert();
        break;
      default:
        img.greyscale();
    }

    const processedBase64 = await img.getBase64Async(Jimp.MIME_JPEG);

    res.json({
      status: 'success',
      processedImage: processedBase64
    });

  } catch (error) {
    console.error('Ошибка при обработке:', error);
    res.status(500).json({ status: 'error', message: 'Ошибка обработки изображения' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
