import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import Redis from './src/services/redis.js'
import ngrok from "@ngrok/ngrok";
import * as dotenv from 'dotenv'
import message from './src/messages/regular.js'
import { menu } from './src/steps/menu.js'
import { getDescription } from './src/steps/get-description.js'
import { getAddress } from './src/steps/get-address.js'
import { getLocation } from './src/steps/get-location.js'
import { getPhoto } from './src/steps/get-photo.js'

const app = express()
app.use(express.json())

let url
const TIMEOUT_RESPONSE = 240
const steps = {
  WELCOME: 0,
  MENU: 1,
  GET_DESCRIPTION: 2,
  GET_LOCATION: 3,
  GET_ADDRESS: 4,
  GET_PHOTO: 5,
  END: 6
}


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

if (process.env.ENV === 'dev') {
  console.log('[loadEnv] dotenv ')
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
const APIKeyCurio = process.env.API_KEY

const options = {
  webHook: {
    port: process.env.PORT
  }
};

const bot = new TelegramBot(TOKEN, options);

console.log(`[index.js] url: ${url}`);

bot.setWebHook(`${url}/bot${TOKEN}`);

try {
  await Redis.createConnection({
    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
  })
} catch (error) {
  console.log('[index.js] error redis', error)
}

// Just to ping!
app.post(`/bot/${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

app.get('/', (req, res) => {
  res.send('Hello Curio Bot')
})


bot.on('message', async (msg) => {
  console.log('[TelegramBot] msg', msg)
  const chatOnRedis = await Redis.get(`chat-${msg.chat.id}`)


  console.log('[TelegramBot] chatOnRedis', chatOnRedis)

  if (msg.text === '/sair') {
    await Redis.set(`chat-${msg.chat.id}`, { step: steps.END, lastMessage: msg }, 1)
    bot.sendMessage(msg.chat.id, message.exitText)
  }

  if (chatOnRedis === 'error_redis') {
    await Redis.set(`chat-${msg.chat.id}`, { step: steps.WELCOME, lastMessage: msg }, 1)
    bot.sendMessage(msg.chat.id, message.errorUnprocessedMessage)

  }

  if (!chatOnRedis || chatOnRedis?.step === steps.WELCOME || msg.text === '/start') {
    await Redis.set(`chat-${msg.chat.id}`, { step: steps.MENU, lastMessage: msg })
    console.log('[TelegramBot] msg', message.welcomeText)
    bot.sendMessage(msg.chat.id, message.welcomeText)

  } else if ((msg.date - chatOnRedis?.lastMessage?.date) > TIMEOUT_RESPONSE) {
    timeout(1000)
    await Redis.set(`chat-${msg.chat.id}`, { step: steps.WELCOME, lastMessage: msg }, 1)
    bot.sendMessage(msg.chat.id, message.exitDelay)

  } else if (chatOnRedis?.step === steps.MENU) {
    const response = await menu(msg, steps, Redis)
    bot.sendMessage(msg.chat.id, response)

  } else if (chatOnRedis?.step === steps.GET_DESCRIPTION) {
    const response = await getDescription(msg, steps, Redis)
    bot.sendMessage(msg.chat.id, response)

  } else if (chatOnRedis?.step === steps.GET_LOCATION) {
    const response = await getLocation(msg, chatOnRedis?.payload, steps, Redis)
    bot.sendMessage(msg.chat.id, response)

  } else if (chatOnRedis?.step === steps.GET_ADDRESS) {
    const response = await getAddress(msg, chatOnRedis.payload, steps, Redis, APIKeyCurio)
    bot.sendMessage(msg.chat.id, response)

  } else if (chatOnRedis?.step === steps.GET_PHOTO) {
    if (!msg.photo) {
      console.log('[getPhoto] payload -> ', payload);
      await Redis.set(`chat-${msg.chat.id}`, { step: steps.GET_LOCATION, lastMessage: msg })
      bot.sendMessage(msg.chat.id, ' 📸 Por favor, enviar uma foto do local: ')

    }
    const endpointImage = await bot.getFileLink(msg.photo[2].file_id);
    console.log('[getPhoto] endpointImage -> ', endpointImage);
    const response = await getPhoto(msg, chatOnRedis.payload, endpointImage, steps, Redis, APIKeyCurio)
    bot.sendMessage(msg.chat.id, response)

  } else {
    console.log('[end] ->  ACABOU PORRA!');
  }
});
