module.exports = {
	name: `+2`,
	text: `Draw 2`,
	level: 0,
	draw_stackable: true,
	async effect({ uno_players }) {
		uno_players.draw_stack += 2;
		uno_players.draw_check = 2;
	},
};
