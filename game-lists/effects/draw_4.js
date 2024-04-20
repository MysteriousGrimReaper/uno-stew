module.exports = {
	name: `+4`,
	text: `Draw 4`,
	draw_stackable: true,
	wild: true,
	async effect({ uno_players }) {
		uno_players.draw_stack += 4;
	},
};
