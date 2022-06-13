const { welcomeText, exitText, exitDelay, errorUnprocessedMessage } = require('../messages/regular');

async function getDescription(ctx) {
  try {
    console.log('[getDescription] ctx.wizard.cursor -> ', ctx.wizard.cursor);
    console.log('[getDescription] -> ctx.wizard.state.lastMessageTime', ctx.wizard.state.lastMessageTime);
    console.log('[getDescription] -> ctx.update.message.date', ctx.update.message.date);

    if (ctx.update.message.text === '/sair') {
      await ctx.reply(exitText);
      return await ctx.scene.leave();
    }

    if ((ctx.update.message.date - ctx.wizard.state.lastMessageTime) > ctx.wizard.state.TIMEOUT_RESPONSE) {
      await ctx.reply(exitDelay);
      return ctx.scene.leave();
    }

    if (ctx.update.message.text.length <= 10) {
      await ctx.reply('Detalhe melhor o problema!');
      ctx.wizard.state.lastMessageTime = ctx.update.message.date;
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.payload = {
      description: ctx.update.message.text,
      reporterUsername: ctx.update.message.from.username,
      category: 'generico'
    }
    console.log('ctx.state.payload -> ', ctx.wizard.state.payload);

    await ctx.reply('Por favor enviar a localição do GPS 🗺️: ');
    ctx.wizard.state.lastMessageTime = ctx.update.message.date;
    return ctx.wizard.next();

  } catch (error) {
    console.log('[getDescription] - error -> ', error);
    await ctx.reply(errorUnprocessedMessage);
    return ctx.scene.leave();
  }
}


module.exports = { getDescription };
