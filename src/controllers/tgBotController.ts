import 'dotenv/config';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;


export const sendToTelegramBot = async (message: string, next: NextFunction) => {
  try {
    await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
    });
    console.log('Message sent to Telegram Bot successfully');
  } catch (e) {
    next(e);

  }
};

export const sendModalCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;
    await sendToTelegramBot(message, next);
    return res.status(200).send('Message sent to Telegram Bot successfully');
  } catch (e) {
    next(e);
  }
};

