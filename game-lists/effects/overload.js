module.exports = {
	name: `ov`,
	text: `Overload`,
	level: 4,
	async effect({ uno_players }) {
		await uno_players.game_channel.send(
			`The pile is now overloaded! Anyone who plays a card other than a Clear card must turn up the heat.`
		);
	},
};
