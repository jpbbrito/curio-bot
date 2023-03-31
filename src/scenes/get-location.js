const { exitText, errorUnprocessedMessage, exitDelay } = require('../messages/regular');

async function getLocation(ctx) {
  await ctx.wizard.state.delayResponse(ctx.wizard.state.DELAY_REPONSE)

  try {
    console.log('[getLocation] ctx.state.payload -> ', ctx.wizard.state.payload);
    console.log('[getLocation] ctx.wizard.cursor -> ', ctx.wizard.cursor);
    console.log('[getLocation] -> location', ctx.update.message);

    if (ctx.update.message.text === '/sair') {
      await ctx.reply(exitText);
      return await ctx.scene.leave();
    }

    if ((ctx.update.message.date - ctx.wizard.state.lastMessageTime) > ctx.wizard.state.TIMEOUT_RESPONSE) {
      await ctx.reply(exitDelay);
      return ctx.scene.leave();
    }

    if (!ctx.update.message.location) {
      await ctx.reply('Por favor enviar a localição do GPS 🗺️: ');
      ctx.wizard.state.lastMessageTime = ctx.update.message.date;
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.payload.latitude = ctx.update.message.location.latitude;
    ctx.wizard.state.payload.longitude = ctx.update.message.location.longitude;

    await ctx.reply('🗺️ Por favor enviar uma descrição do endereço para ajudar a encontrar o local: ');
    ctx.wizard.state.lastMessageTime = ctx.update.message.date;
    return await ctx.wizard.next();
  } catch (error) {
    console.log('[getLocation] - error -> ', error);
    try {
      await ctx.reply(errorUnprocessedMessage);
      return ctx.scene.leave();
    } catch (error) {
      console.log('[getLocation] - errorUnprocessedMessage - error -> ', error);
      return ctx.scene.leave();
    }
  }
}

module.exports = { getLocation };