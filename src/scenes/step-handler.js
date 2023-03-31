const { welcomeText, exitText, exitDelay, errorUnprocessedMessage } = require('../messages/regular');


async function stepHandler(ctx) {
  await ctx.wizard.state.delayResponse(ctx.wizard.state.DELAY_REPONSE)

  try {
    console.log('[stepHandler] -> ctx.wizard.state.lastMessageTime', ctx?.wizard?.state?.lastMessageTime);
    console.log('[stepHandler] -> ctx.update.message.date', ctx?.update?.message?.date);
    console.log('(ctx.update.message.date - ctx.wizard.state.lastMessageTime)', ctx?.update?.message?.date - ctx.wizard.state.lastMessageTime)
    console.log('[stepHandler] -> ctx.update.message', ctx?.update?.message);

    if (!ctx.update.message.text) {
      await ctx.reply('Somente texto nessa conversa');
      return ctx.scene.leave();
    }

    if ((ctx.update.message.date - ctx.wizard.state.lastMessageTime) > ctx.wizard.state.TIMEOUT_RESPONSE) {
      await ctx.reply(exitDelay);
      return ctx.scene.leave()
    }

    if (ctx.update.message.text === '/sair') {
      await ctx.reply(exitText);
      return await ctx.scene.leave();
    }

    if (ctx.update.message.text === '/registrarProblema') {
      await ctx.reply('⌨️ Descreva o problema encontrado: ');
      ctx.wizard.state.lastMessageTime = ctx.update.message.date;
      return await ctx.wizard.next();
    }
    ctx.wizard.state.lastMessageTime = ctx.update.message.date;
    return ctx.wizard.next();
  } catch (error) {
    console.log('[stepHandler] - error -> ', error);
    try {
      await ctx.reply(errorUnprocessedMessage);
      return ctx.scene.leave();
    } catch (error) {
      console.log('[stepHandler] - errorUnprocessedMessage - error -> ', error);
      return ctx.scene.leave();
    }
  }
}

module.exports = { stepHandler };