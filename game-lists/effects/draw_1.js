module.exports = {
	name: `+1`,
	text: `Draw 1`,
	level: 1,
	draw_stackable: true,
	async effect({ uno_players, pile_index }) {
		uno_players.draw_stack += 1;
		uno_players.draw_stack_pile_index = pile_index;
		uno_players.draw_check = 1;
	},
};
