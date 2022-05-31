const { Markup } = require('telegraf');

const curioServices = require('./services/curio-services');

module.exports = {
  async start(ctx) {
    console.log('message', ctx.update.message)
    await ctx.replyWithMarkdownV2(
      `🔨 *Curió Bot* 👨🏼‍🔧 \n\nOlá, sou um robô para você relatar os problemas encontrados em sua cidade`,
      Markup.inlineKeyboard([
        Markup.button.callback('🛑 Sair', 'leave'),
        Markup.button.callback('➡️ Registrar problema!', 'next'),
      ])
    )
    return ctx.wizard.next()
  },
  async getDescription(ctx) {
    console.log('[getDescription] ctx.wizard -> ', ctx.wizard);
    console.log('[getDescription] ctx.wizard.steps -> ', ctx.wizard.steps);
    console.log('[getDescription] ctx.wizard.cursor -> ', ctx.wizard.cursor);

    if (ctx.update.message.text.length <= 10) {
      await ctx.reply('Detalhe melhor o problema!');
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }
    
    ctx.wizard.state.payload = { 
      description: ctx.update.message.text,
      reporterUsername: ctx.update.message.from.username,
      category: 'generico'
    }
    console.log('ctx.state.payload -> ', ctx.wizard.state.payload);

    await ctx.reply('Por favor enviar a localição do GPS 🗺️: ');
    return ctx.wizard.next()
  },
  async getLocation(ctx) {
    console.log('[getLocation] -> location', ctx.update);
    console.log('[getLocation] ctx.state.payload -> ',  ctx.wizard.state.payload);
    console.log('[getLocation] ctx.wizard -> ', ctx.wizard);
    console.log('[getLocation] ctx.wizard.cursor -> ', ctx.wizard.cursor);

    if (!ctx.update.message.location) {
      await ctx.reply('Por favor enviar a localição do GPS 🗺️: ');
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.payload.latitude = ctx.update.message.location.latitude;
    ctx.wizard.state.payload.longitude = ctx.update.message.location.longitude;

    await ctx.reply('🗺️ Por favor enviar uma descrição do endereço para ajudar a encontrar o local: ');
    return await ctx.wizard.next();
  }, 
  async getAddress(ctx) {
    console.log('[getAddress] -> location', ctx.update);
    console.log('[getAddress] ctx.state.payload -> ',  ctx.wizard.state.payload);
    console.log('[getAddress] ctx.wizard -> ', ctx.wizard);
    console.log('[getAddress] ctx.wizard.cursor -> ', ctx.wizard.cursor);
    if(!ctx.update.message.text) {
      await ctx.reply('🗺️ Por favor enviar uma descrição do endereço para ajudar a encontrar o local: ');
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.payload.address = ctx.update.message.text;

    const response = await curioServices.saveProblem(ctx.wizard.state.payload, process.env.API_KEY);
    if(response === 'error_api') {
      await ctx.reply('🛑 Houve um erro, tentar novamente mais tarde!');
      return await ctx.scene.leave();
    }
    console.log('[getAddress] response -> ', response);
    await ctx.reply('👨🏼‍🔧 Muito obrigado pela ajuda!');
    return await ctx.scene.leave();
  },
  async endScene(ctx) {
    console.log('ctx.state.payload -> ', ctx.state.payload);
    console.log('Final -> message', ctx.update.message);
    await ctx.reply('Done');
    return await ctx.scene.leave();
  }
}