const { Composer, Telegraf, session, Scenes } = require('telegraf');
const express = require('express');

const app = express();

require('dotenv').config({
  path: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.env'
});

console.log('[index] process.env.URL_SERVER_API', process.env.URL_SERVER_API);

const {
  start,
  stepHandler,
  getDescription,
  getLocation,
  getAddress,
  getPhoto,
  endScene,
} = require('./src/scenes');

const bot = new Telegraf(process.env.TOKEN);

const superWizard = new Scenes.WizardScene(
  'super-wizard',
  start,
  stepHandler,
  getDescription,
  getLocation,
  getAddress,
  getPhoto,
  endScene,
)

const stage = new Scenes.Stage([superWizard], {
  default: 'super-wizard',
});
bot.use(session())
bot.use(stage.middleware())

async function startBot () {
  try {
    bot.webhookCallback(bot.secretPathComponent())
    bot.launch()
  } catch (error) {
    console.log('[index.js] error', error)
    
  }
  
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

startBot()


