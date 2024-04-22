module.exports = {
	name: `sk`,
	text: `Skip`,
	level: 0,
	async effect({ uno_players }) {
		uno_players.step();
		const skipped_player = uno_players.current_user;
		await uno_players.game_channel.send(
			`${
				skipped_player.globalName ?? skipped_player.username
			}, skip a turn.`
		);
	},
};
