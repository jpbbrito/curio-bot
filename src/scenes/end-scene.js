
async function endScene(ctx) {
    await ctx.wizard.state.delayResponse(ctx.wizard.state.DELAY_REPONSE)

    try {
        console.log('ctx.state.payload -> ', ctx.state.payload);
        console.log('Final -> message', ctx.update.message);
        await ctx.reply('Done');
        return await ctx.scene.leave();
    } catch (error) {
        try {
            await ctx.reply(errorUnprocessedMessage);
            return ctx.scene.leave();
        } catch (error) {
            console.log('[endScene] - errorUnprocessedMessage - error -> ', error);
            return ctx.scene.leave();
        }
    }
}

module.exports = { endScene };