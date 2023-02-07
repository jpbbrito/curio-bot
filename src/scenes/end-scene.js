
function timeout (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function endScene(ctx) {
    await timeout(1000)
    console.log('ctx.state.payload -> ', ctx.state.payload);
    console.log('Final -> message', ctx.update.message);
    await ctx.reply('Done');
    return await ctx.scene.leave();
}

module.exports = { endScene };