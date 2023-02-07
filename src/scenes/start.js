const { welcomeText, exitText, errorUnprocessedMessage } = require('../messages/regular');

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function start(ctx) {
  await timeout(1000)
  ctx.wizard.state.TIMEOUT_RESPONSE = 60;
  try {
    console.log('[start] ctx.wizard.steps -> ', ctx.wizard.steps);
    console.log('[start] ctx.wizard.cursor -> ', ctx.wizard.cursor);
    console.log('[start] ctx.wizard.message', ctx.update.message);

    if (!ctx.update.message.text) {
      throw Error('Somente texto nessa conversa');
    }

    ctx.wizard.state.lastMessageTime = ctx.update.message.date;

    await ctx.reply(welcomeText);
    return ctx.wizard.next();
  } catch (error) {
    console.log('[getDescription] - error -> ', error);
    await ctx.reply(errorUnprocessedMessage);
    return ctx.scene.leave();
  }
}

module.exports = { start };
