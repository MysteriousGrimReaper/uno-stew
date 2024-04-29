module.exports = {
	name: `+4`,
	text: `Draw 4`,
	draw_stackable: true,
	wild: true,
	level: 0,
	async effect({ uno_players, pile_index }) {
		uno_players.draw_stack += 4;
		uno_players.draw_stack_pile_index = pile_index;
		uno_players.draw_check = 4;
	},
};
