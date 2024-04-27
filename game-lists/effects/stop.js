module.exports = {
	name: `stop`,
	text: `Stop`,
	level: 6,
	async effect({ uno_players, pile_index }) {
		await uno_players.game_channel.send(
			`Pile ${pile_index} is now inactive.`
		);
	},
};
