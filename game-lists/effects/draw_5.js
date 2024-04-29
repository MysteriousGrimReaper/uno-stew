module.exports = {
	name: `+5`,
	text: `Draw 5`,
	draw_stackable: true,
	wild: true,
	level: 1,
	async effect({ uno_players, pile_index }) {
		uno_players.draw_stack += 5;
		uno_players.draw_stack_pile_index = pile_index;
		uno_players.draw_check = 5;
	},
};
