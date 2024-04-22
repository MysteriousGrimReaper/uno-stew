module.exports = {
	name: `pa`,
	text: `Popcorn for All`,
	wild: true,
	level: 5,
	async effect({ uno_players }) {
		uno_players.forEach((player) => player.popcorn++);
		await uno_players.game_channel.send(
			`Everyone got a fresh bucket of popcorn!`
		);
	},
};
