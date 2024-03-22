module.exports = {
	name: `+a2`,
	text: `All Draw 2`,
	async effect({ uno_players }) {
		uno_players.forEach(async player => {
            await player.draw(uno_players.drawpile, 2)
        });
	},
};
