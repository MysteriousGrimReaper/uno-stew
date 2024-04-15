module.exports = {
	name: `@+4`,
	text: `Targeted Draw 4`,
	async effect({ uno_players, player }) {
		await uno_players.game_channel.send(
			`${player.user}, type the name of a player to force them to draw 4 cards.`
		);
		const trade_hands_promise = new Promise((resolve) => {
			const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command

			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
			});
			collector.on("collect", async (collectedMessage) => {
				// Check the collected message for the specific condition (e.g., contains a certain word)
				const target_player = uno_players.find_player_by_name(
					collectedMessage.content.toLowerCase()
				);
				if (target_player) {
					await collectedMessage.reply(
						`${target_player.user}, draw four cards.`
					);
					target_player.draw(uno_players.drawpile, 4)
					collector.stop();
				}
			});

			collector.on("end", (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send(
						"You timed out."
					);
				}
                resolve();
			});
		});
		await trade_hands_promise;
	},
};
