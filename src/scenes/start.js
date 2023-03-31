const { welcomeText, exitText, errorUnprocessedMessage } = require('../messages/regular');

async function start(ctx) {
  console.log('[start] ctx.wizard.message', ctx.update.message); 

  ctx.wizard.state.delayResponse = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  ctx.wizard.state.TIMEOUT_RESPONSE = 60;
  ctx.wizard.state.DELAY_REPONSE = 500;

  await ctx.wizard.state.delayResponse(ctx.wizard.state.DELAY_REPONSE)

  try {
    console.log('[start] ctx.wizard.steps -> ', ctx.wizard.steps);
    console.log('[start] ctx.wizard.cursor -> ', ctx.wizard.cursor);
    console.log('[start] ctx.wizard.message', ctx.update.message);

    if (!ctx.update.message.text) {
      await ctx.reply('Somente texto nessa conversa');
      return ctx.scene.leave();
    }

    ctx.wizard.state.lastMessageTime = ctx.update.message.date;

    await ctx.reply(welcomeText);
    return ctx.wizard.next();
  } catch (error) {
    console.log('[getDescription] - error -> ', error);
    try {
      await ctx.reply(errorUnprocessedMessage);
      return ctx.scene.leave();
    } catch (error) {
      console.log('[getDescription] - errorUnprocessedMessage - error -> ', error);
      return ctx.scene.leave();
    }
  }
}

module.exports = { start };
