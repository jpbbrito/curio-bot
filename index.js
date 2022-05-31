const { Composer, Telegraf, session, Scenes, Markup } = require('telegraf');

require('dotenv').config({
    path: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.env' 
})

const { start, getDescription, getLocation, endScene, getAddress } = require('./src/scene')
const bot = new Telegraf(process.env.TOKEN);

const stepHandler = new Composer()
stepHandler.action('next', async (ctx) => {
  await ctx.reply('⌨️ Descreva o problema encontrado: ')
  return ctx.wizard.next()
});
stepHandler.action('leave', async (ctx) => {
  await ctx.reply('🏃Saindo da conversa...')
  return ctx.scene.leave()
});

const superWizard = new Scenes.WizardScene(
  'super-wizard',
  start,
  stepHandler,
  getDescription,
  getLocation,
  getAddress,
  endScene,
)

const stage = new Scenes.Stage([superWizard], {
  default: 'super-wizard',
})
bot.use(session())
bot.use(stage.middleware())
bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
