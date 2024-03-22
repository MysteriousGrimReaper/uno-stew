module.exports = {
	name: `fs`,
	text: `Foresight`,
	async effect({ uno_players, player }) {
        await uno_players.game_channel.send(`${player.user.globalName ?? player.user.username}, check your direct messages.`)
		await player.user.send(`The top 5 cards of the deck are:\n- ${uno_players.drawpile.slice(uno_players.drawpile.length - 5).map(card => card.text).reverse().join(`\n- `)}`)
	},
};
