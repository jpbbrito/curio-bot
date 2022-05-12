require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.test.env' : '.env' 
})
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TOKEN)

bot.start((ctx) => {
    const from = ctx.update.message.from;
    
    console.log(from)
    ctx.reply(`Olá ${from.username}`);
});
bot.on('sticker', (ctx) => {
    console.log(ctx.update.message)
    ctx.reply('👍');
});

bot.command('novoProblema', (ctx) => {
    console.log(ctx.message);
    ctx.reply('Cadastrado');
});
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))