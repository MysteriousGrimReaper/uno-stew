module.exports = {
	name: `+10`,
	text: `Draw 10`,
	draw_stackable: true,
	async effect({ uno_players }) {
		uno_players.draw_stack += 10;
	},
};
