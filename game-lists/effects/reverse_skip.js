module.exports = {
	name: `rsk`,
	text: `Reverse Skip`,
	wild: true,
	async effect({ uno_players }) {
		uno_players.reverse();
		uno_players.step();
		await uno_players.game_channel.send(
			`${uno_players.current_user}, skip a turn.`
		);
	},
};
