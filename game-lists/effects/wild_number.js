module.exports = {
	name: `wn`,
	text: `Wild Number`,
	level: 5,
	wild: false,
	async effect({ uno_players, player, pile_chosen }) {
		await uno_players.game_channel.send({
			content: `Choose a number to set this card's value to.`,
		});
		const wild_number_promise = new Promise((resolve) => {
			const filter = (m) =>
				m.author.id === player.user.id &&
				!(
					(parseInt(m.content) < 0 && parseInt(m.content) != -10) ||
					parseInt(m.content) > 23
				); // Only collect messages from the author of the command
			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
				max: 1,
			});
			collector.on("collect", async (m) => {
				pile_chosen.top_card.icon = m.content;
				console.log(pile_chosen.top_card);
				await uno_players.game_channel.send(
					`Pile ${
						uno_players.drawpile.discardpiles.indexOf(pile_chosen) +
						1
					}'s top card is now a **${pile_chosen.top_card.text}**.`
				);
				collector.stop();
				resolve();
			});

			collector.on("end", (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send(
						"You timed out, the number will be set to 0."
					);
					pile_chosen.top_card.icon = `0`;
					collector.stop();
					resolve();
				}
			});
		});
		await wild_number_promise;
	},
};
