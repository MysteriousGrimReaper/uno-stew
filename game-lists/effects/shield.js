module.exports = {
	name: `sd`,
	text: `Shield`,
	draw_stackable: true,
	async effect({ uno_players }) {
		uno_players.draw_stack = 0;
		await uno_players.game_channel.send(`You blocked the stack!`);
	},
};
