
async function endScene(ctx) {
    console.log('ctx.state.payload -> ', ctx.state.payload);
    console.log('Final -> message', ctx.update.message);
    await ctx.reply('Done');
    return await ctx.scene.leave();
}

module.exports = { endScene };