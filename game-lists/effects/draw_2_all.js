module.exports = {
	name: `+k`,
	text: `Kettle`,
	wild: true,
	async effect({ uno_players }) {
		uno_players.forEach(async (player) => {
			await player.draw(uno_players.drawpile, 2);
		});
	},
};
