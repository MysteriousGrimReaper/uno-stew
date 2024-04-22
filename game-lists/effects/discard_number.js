module.exports = {
	name: `-n`,
	text: `Discard Number`,
	wild: true,
	level: 5,
	async effect({ uno_players, player, pile_chosen }) {
		await uno_players.game_channel.send({
			content: `Choose a number to discard.`,
		});
		const discard_promise = new Promise((resolve) => {
			const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command
			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
			});
			collector.on("collect", async (collectedMessage) => {
				const number = collectedMessage.content;
				if (isNaN(parseInt(number))) {
					return;
				}
				const original_hand_length = player.hand.length;
				player.hand.forEach((card) => {
					if (card.icon == number) {
						player.play(card, pile_chosen);
					}
				});
				await uno_players.game_channel.send(
					`${player.user.globalName ?? player.user.username} played ${
						original_hand_length - player.hand.length
					} cards!`
				);
				collector.stop();
				resolve();
			});

			collector.on("end", (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send("You timed out.");
					collector.stop();
					resolve();
				}
			});
		});
		await discard_promise;
	},
};
