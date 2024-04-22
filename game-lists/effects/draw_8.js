module.exports = {
	name: `+8`,
	text: `Draw 8`,
	level: 1,
	draw_stackable: true,
	wild: true,
	async effect({ uno_players }) {
		uno_players.draw_stack += 8;
		uno_players.draw_check = 8;
	},
};
