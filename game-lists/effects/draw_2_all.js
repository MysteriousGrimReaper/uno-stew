module.exports = {
	name: `+k`,
	text: `Kettle`,
	wild: true,
	level: 2,
	async effect({ uno_players }) {
		uno_players.forEach(async (player) => {
			await player.draw(uno_players.drawpile, 2);
		});
		await uno_players.game_channel.send(`All players have drawn 2 cards!`);
	},
};
