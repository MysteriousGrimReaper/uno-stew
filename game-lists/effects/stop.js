module.exports = {
	name: `stop`,
	text: `Stop`,
	level: 6,
	async effect({ uno_players, pile_index }) {
		await uno_players.game_channel.send(
			`Dish ${pile_index + 1} is now inactive.`
		);
	},
};
