module.exports = {
	name: `fl`,
	text: `Flip`,
	level: 2,
	async effect({ uno_players }) {
		uno_players.forEach((p) => {
			p.hand.flip();
			p.user.send(`Your new hand:\n${p.hand.default_text}`);
		});
		uno_players.drawpile.flip();
		await uno_players.game_channel.send(`All cards have been flipped!`);
	},
};
