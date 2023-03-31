const axios = require('axios').default;
const curioServices = require('../services/curio-services');
const { exitDelay, errorUnprocessedMessage } = require('../messages/regular');
const { Buffer } = require('buffer');


async function getPhoto(ctx) {
    await ctx.wizard.state.delayResponse(ctx.wizard.state.DELAY_REPONSE)

    try {
        console.log('[getPhoto] ctx.state.payload -> ', ctx.wizard.state.payload);
        console.log('[getPhoto] ctx.update.message -> ', ctx.update.message);
        console.log('[getPhoto] ctx.wizard.cursor -> ', ctx.wizard.cursor);

        if (ctx.update.message.text === '/sair') {
            await ctx.reply('🏃Saindo da conversa...');
            return await ctx.scene.leave();
        }

        if ((ctx.update.message.date - ctx.wizard.state.lastMessageTime) > ctx.wizard.state.TIMEOUT_RESPONSE) {
            await ctx.reply(exitDelay);
            return ctx.scene.leave();
        }

        console.log('[getPhoto] ctx.wizard.cursor -> ', ctx.update.message.photo);
        if (!ctx.update.message.photo) {
            console.log('ctx.state.payload -> ', ctx.wizard.state.payload);
            await ctx.reply(' 📸 Por favor, enviar uma foto do local: ');
            ctx.wizard.state.lastMessageTime = ctx.update.message.date;
            return await ctx.wizard.next();
        }
        const endpointImage = await ctx.telegram.getFileLink(ctx.update.message.photo[2].file_id);
        console.log('[getPhoto] - endpointImage ', endpointImage);
        let response;
        try {
            response = await axios({
                url: endpointImage.href,
                method: 'GET',
                responseType: 'arraybuffer'
            });
        } catch (error) {
            console.log('[getPhoto] - error ', error);
            await ctx.reply('🛑 Houve um erro, tentar novamente mais tarde!');
            return await ctx.scene.leave();
        }

        console.log('[getPhoto] - response ', response);
        console.log('[getPhoto] - type response ', typeof response);

        const encodedData = Buffer.from(response.data, 'binary').toString('base64');

        const result = await curioServices.saveImageProblem({
            uuid: ctx.wizard.state.payload.uuid,
            base64: encodedData
        }, process.env.API_KEY);

        if (result === 'error_api') {
            await ctx.reply('🛑 Houve um erro, tentar novamente mais tarde!');
            return await ctx.scene.leave();
        }

        console.log('[getPhoto] result -> ', result);
        await ctx.reply('👨🏼‍🔧 Muito obrigado pela ajuda! \n /start - Caso queira relatar mais uma dificuldade. ');
        return await ctx.scene.leave();
    } catch (error) {
        console.log('[getPhoto] - error -> ', error);
        try {
            await ctx.reply(errorUnprocessedMessage);
            return ctx.scene.leave();
        } catch (error) {
            console.log('[getPhoto] - errorUnprocessedMessage - error -> ', error);
            return ctx.scene.leave();
        }
    }
}

module.exports = { getPhoto };