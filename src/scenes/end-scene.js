
async function endScene(ctx) {
    await ctx.wizard.state.delayResponse(ctx.wizard.state.DELAY_REPONSE)
    
    console.log('ctx.state.payload -> ', ctx.state.payload);
    console.log('Final -> message', ctx.update.message);
    await ctx.reply('Done');
    return await ctx.scene.leave();
}

module.exports = { endScene };