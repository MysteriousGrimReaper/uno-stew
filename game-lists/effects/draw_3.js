module.exports = {
	name: `+3`,
	text: `Draw 3`,
	draw_stackable: true,
	level: 1,
	async effect({ uno_players, pile_index }) {
		uno_players.draw_stack += 3;
		uno_players.draw_stack_pile_index = pile_index;
		uno_players.draw_check = 3;
	},
};
