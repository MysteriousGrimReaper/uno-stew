module.exports = {
	name: `+7`,
	text: `Draw 7`,
	level: 1,
	draw_stackable: true,
	wild: true,
	async effect({ uno_players, pile_index }) {
		uno_players.draw_stack += 7;
		uno_players.draw_stack_pile_index = pile_index;
		uno_players.draw_check = 7;
	},
};
