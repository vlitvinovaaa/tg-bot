const TelegramBot = require('node-telegram-bot-api');
const randomWords = require('random-words');
const Jimp = require('jimp');

const bot = new TelegramBot('6280948390:AAE57h9He1yq7zDU5_SpFMtFU3CEy-Ohki8', { polling: true });

bot.on('message', async (msg) => {
    // Check if message contains a photo
    if (msg.photo) {
        // Get information about the largest photo sent
        const photo = msg.photo.pop();

        try {
            // Download the photo from Telegram's servers
            const path = await bot.downloadFile(photo.file_id, 'photos');

            // Generate a random caption using the random-words package
            const caption = randomWords({ min: 3, max: 10 }).join(' ');

            // Load the photo into Jimp and add the caption
            const image = await Jimp.read(path);
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            image.print(font, 10, 10, caption);

            // Save the modified photo to a file
            const modifiedPath = `modified-${photo.file_unique_id}.jpg`;
            await image.writeAsync(modifiedPath);

            // Send the modified photo back to the user
            bot.sendPhoto(msg.chat.id, modifiedPath);
        } catch (err) {
            console.error(err);
        }
    }
});
