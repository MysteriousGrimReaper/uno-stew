module.exports = {
	name: `+10`,
	text: `Draw 10`,
	draw_stackable: true,
	wild: true,
	level: 1,
	async effect({ uno_players }) {
		uno_players.draw_stack += 10;
		uno_players.draw_check = 10;
	},
};
