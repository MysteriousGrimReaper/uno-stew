module.exports = {
	name: `-4`,
	text: `Undraw 4`,
	draw_stackable: true,
	wild: true,
	level: 1,
	async effect({ uno_players }) {
		uno_players.draw_stack -= 4;
		if (uno_players.draw_stack < 0) {
			uno_players.draw_stack = 0;
		}
		uno_players.draw_check = 0;
	},
};
