module.exports = {
	name: `+o1`,
	text: `Others Draw 1`,
	wild: true,
	level: 2,
	async effect({ uno_players, player }) {
		uno_players.forEach(async (p) => {
			if (player.user.id == p.user.id) {
				return;
			}
			await p.draw(uno_players.drawpile, 1);
		});
	},
};
