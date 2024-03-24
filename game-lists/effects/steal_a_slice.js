module.exports = {
	name: `steal`,
	text: `Steal A Slice`,
	async effect({ uno_players, player }) {
		if (uno_players.length == 2) {
			await uno_players.game_channel.send(
				uno_players.next_player.pizza == 0 ? `Your opponent has no more pizza, they must draw one card.` : `You stole a slice of pizza from your opponent.`
			);
			await player.steal(uno_players.next_player)
			return;
		}
		await uno_players.game_channel.send(
			`${player.user}, type the name of a player to steal a slice of pizza from.`
		);
		const trade_hands_promise = new Promise((resolve) => {
			const filter = (m) => m.author.id === player.user.id && uno_players.find_player_by_name(m.content.toLowerCase()); // Only collect messages from the author of the command

			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
                max: 1
			});
			collector.on("collect", async (collectedMessage) => {
				// Check the collected message for the specific condition (e.g., contains a certain word)
				const target_player = uno_players.find_player_by_name(
					collectedMessage.content.toLowerCase()
				);
				if (target_player) {
					await collectedMessage.reply(
						target_player.pizza == 0 ? `That player has no more pizza, they will draw one card.` : `You stole a slice of pizza from ${target_player.user}.`
					);
					await player.steal(target_player)
					collector.stop();
					resolve(); // Resolve the promise when the condition is met
				}
			});

			collector.on("end", (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send(
						"You timed out. The pizza has gone cold."
					);
					collector.stop();
					resolve(); // Resolve the promise when the condition is met
				}
			});
		});
		await trade_hands_promise;
	},
};
