module.exports = {
	name: `+md`,
	text: `Meltdown`,
	async effect({ uno_players }) {
		uno_players.forEach(async (player) => {
			await player.draw(
				uno_players.drawpile,
				Math.ceil(4 * Math.random())
			);
		});
	},
};
