const curioServices = require('../services/curio-services');
const { exitDelay, errorUnprocessedMessage } = require('../messages/regular');

async function getAddress(ctx) {
  try {
    console.log('[getAddress] ctx.wizard.cursor -> ', ctx.wizard.cursor);
    console.log('[getAddress] -> location', ctx.update);
    console.log('[getAddress] ctx.state.payload -> ', ctx.wizard.state.payload);
    console.log('[getAddress] ctx.wizard.cursor -> ', ctx.wizard.cursor);
    console.log('[getAddress] -> ctx.wizard.state.lastMessageTime', ctx.wizard.state.lastMessageTime);
    console.log('[getAddress] -> ctx.update.message.date', ctx.update.message.date);

    if (!ctx.update.message.text) {
      throw Error('Somente texto nessa conversa');
    }

    if (ctx.update.message.text === '/sair') {
      await ctx.reply('🏃Saindo da conversa...');
      return await ctx.scene.leave();
    }

    if ((ctx.update.message.date - ctx.wizard.state.lastMessageTime) > ctx.wizard.state.TIMEOUT_RESPONSE) {
      await ctx.reply(exitDelay);
      return ctx.scene.leave();
    }

    if (!ctx.update.message.text) {
      await ctx.reply('🗺️ Por favor enviar uma descrição do endereço para ajudar a encontrar o local: ');
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.payload.address = ctx.update.message.text;

    const response = await curioServices.saveProblem(ctx.wizard.state.payload, process.env.API_KEY);
    if (response === 'error_api') {
      await ctx.reply('🛑 Houve um erro, tentar novamente mais tarde!');
      return await ctx.scene.leave();
    }
    
    ctx.wizard.state.payload.uuid = response.uuid;

    await ctx.reply(' 📸 Envia uma foto do local: ');
    ctx.wizard.state.lastMessageTime = ctx.update.message.date;
    return ctx.wizard.next();
  } catch (error) {
    console.log('[getDescription] - error -> ', error);
    await ctx.reply(errorUnprocessedMessage);
    return ctx.scene.leave();
  }
}

module.exports = { getAddress };