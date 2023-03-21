const TelegramBot = require('node-telegram-bot-api');
const Jimp = require('jimp');
const fs = require('fs');

// Create a bot that uses 'polling' to fetch new updates
const token = '6280948390:AAE57h9He1yq7zDU5_SpFMtFU3CEy-Ohki8';
const bot = new TelegramBot(token, { polling: true });

// Listen for incoming messages
bot.on('message', async (msg) => {
    if (msg.photo) {
        try {
            // Get the file ID of the largest photo
            const fileId = msg.photo[msg.photo.length - 1].file_id;

            // Download the photo
            const filePath = await bot.downloadFile(fileId, './photos');
            const imageBuffer = await fs.promises.readFile(filePath);

            // Load the image
            const image = await Jimp.read(imageBuffer);

            // Load the Lobster font
            const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

            // Add the text to the image
            const text = 'LOL OMFG';
            const textWidth = Jimp.measureText(font, text);
            const x = (image.getWidth() - textWidth) / 2;
            const y = image.getHeight() - 40;
            image.print(font, x, y, {
                text,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
            });

            // Send the edited image back to the user
            bot.sendPhoto(msg.chat.id, await image.getBufferAsync(Jimp.MIME_JPEG));
        } catch (error) {
            console.error(error);
            bot.sendMessage(msg.chat.id, 'An error occurred while processing your image. Please try again later.');
        }
    }
});
