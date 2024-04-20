module.exports = {
	name: `+8`,
	text: `Draw 8`,
	draw_stackable: true,
	wild: true,
	async effect({ uno_players }) {
		uno_players.draw_stack += 8;
	},
};
