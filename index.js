import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { createServer } from 'http'

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch({
    webhook: {
        // Public domain for webhook; e.g.: example.com
        domain: 'curio-bot.onrender.com',

        // Port to listen on; e.g.: 8080
        port: process.env.PORT,
    }
})

createServer(await bot.createWebhook({ domain: "curio-bot.onrender.com'" })).listen(process.env.PORT);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))