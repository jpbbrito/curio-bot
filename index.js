import TelegramBot from 'node-telegram-bot-api'
import Redis from './src/services/redis.js'
import ngrok from "@ngrok/ngrok";
import * as dotenv from 'dotenv'

let url

if (process.env.ENV === 'dev') {
  console.log('[loadEnv] - ')
  dotenv.config({ path: '.dev.env' })
  const listener = await ngrok.connect({
    port: parseInt(process.env.PORT),
    proto: 'http',
    authtoken: process.env.NGROK_TOKEN,
    domain: process.env.NGROK_URL
  })
  console.log(`Ingress established at: ${listener.url()}`);
  url = listener.url()
} else {
  url = process.env.URL_BOT
}

const TOKEN = process.env.TELEGRAM_TOKEN;

const options = {
  webHook: {
    port: process.env.PORT
  }
};

const bot = new TelegramBot(TOKEN, options);

console.log(`[index.js] url: ${url}`);

bot.setWebHook(`${url}/bot${TOKEN}`);

await Redis.createConnection({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD
})

// Just to ping!
bot.on('message', function onMessage(msg) {
  console.log('[TelegramBot] msg', msg)
  if (msg.text === '/start') {
    bot.sendMessage(msg.chat.id, 'Começa aqui desgraça!');
  } else {
    bot.sendMessage(msg.chat.id, 'I am alive on Heroku!');
  }
});
