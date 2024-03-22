module.exports = {
	name: `+1-6`,
	text: `Draw 1-6`,
	draw_stackable: true,
	async effect({ uno_players }) {
		uno_players.draw_stack += Math.ceil(Math.random() * 6);
	},
};
