module.exports = {
	name: `tp`,
	text: `Trade Places`,
	level: 3,
	wild: true,
	async effect({ uno_players, player }) {
		if (uno_players.length == 2) {
			await uno_players.game_channel.send(
				`You traded spots and hands with your opponent.`
			);
			[uno_players[0].hand, uno_players[1].hand] = [
				uno_players[1].hand,
				uno_players[0].hand,
			];
			[uno_players[0], uno_players[1]] = [uno_players[1], uno_players[0]];
			return;
		}
		await uno_players.game_channel.send(
			`${player.user}, type the name of a player to trade spots and hands with them.`
		);
		const trade_hands_promise = new Promise((resolve) => {
			const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command

			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
			});
			collector.on("collect", async (collectedMessage) => {
				// Check the collected message for the specific condition (e.g., contains a certain word)
				let target_player = uno_players.find_player_by_name(
					collectedMessage.content.toLowerCase()
				);
				if (target_player) {
					await collectedMessage.reply(
						`You traded hands with ${target_player.user}.`
					);
					[target_player.hand, player.hand] = [
						player.hand,
						target_player.hand,
					];
					[target_player, player] = [player, target_player];
					collector.stop();
					resolve(); // Resolve the promise when the condition is met
				}
			});

			collector.on("end", (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send(
						"You timed out. Trading with a another player..."
					);
					const target_player = uno_players.next_player;

					[target_player.hand, player.hand] = [
						player.hand,
						target_player.hand,
					];
					uno_players.game_channel.send(
						`You traded hands with ${target_player.user}.`
					);

					collector.stop();
					resolve(); // Resolve the promise when the condition is met
				}
			});
		});
		await trade_hands_promise;
	},
};
