module.exports = {
	name: `sd`,
	text: `Shield`,
	draw_stackable: true,
	level: 4,
	async effect({ uno_players }) {
		if (uno_players.draw_stack > 0) {
			uno_players.draw_stack = 0;
			await uno_players.game_channel.send(`You blocked the stack!`);
		}
	},
};
