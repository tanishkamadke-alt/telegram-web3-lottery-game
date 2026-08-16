import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.on("polling_error", (error) => {
  console.error("Polling Error:");
  console.error(error);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🎉 Welcome to CipherDraw!\n\nClick the button below to launch the Mini App.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Open CipherDraw",
              web_app: {
                url: process.env.https://telegram-web3-lottery-game.vercel.app,

              },
            },
          ],
        ],
      },
    }
  );
});

console.log("🤖 Telegram Bot Started");

