module.exports = {
	name: `po`,
	text: `Popcorn`,
	async effect({ uno_players, player }) {
		player.popcorn++
        await uno_players.game_channel.send(`${player.user} got a fresh bucket of popcorn!`)
	},
};
