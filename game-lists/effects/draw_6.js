module.exports = {
	name: `+6`,
	text: `Draw 6`,
	draw_stackable: true,
	wild: true,
	level: 1,
	async effect({ uno_players, pile_index }) {
		uno_players.draw_stack += 6;
		uno_players.draw_stack_pile_index = pile_index;
		uno_players.draw_check = 6;
	},
};
