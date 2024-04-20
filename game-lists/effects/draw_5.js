module.exports = {
	name: `+5`,
	text: `Draw 5`,
	draw_stackable: true,
	wild: true,
	async effect({ uno_players }) {
		uno_players.draw_stack += 5;
	},
};
