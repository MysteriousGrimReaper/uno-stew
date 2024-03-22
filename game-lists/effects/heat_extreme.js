module.exports = {
	name: `xh`,
	text: `Extreme Heat`,
	async effect({ uno_players, player }) {
		if (uno_players.length == 2) {
			await uno_players.game_channel.send(`You heated up your opponent.`);
			uno_players.attack(
				2,
				uno_players[(uno_players.current_turn_index + 1) % 2]
			);
			return;
		}
		await uno_players.game_channel.send(
			`${player.user}, type the name of a player to heat up.`
		);
		const extreme_heat_promise = new Promise((resolve) => {
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
						`You heated ${target_player.user}.`
					);
					uno_players.attack(2, target_player);
					collector.stop();
					resolve(); // Resolve the promise when the condition is met
				}
			});

			collector.on("end", (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send(
						"You timed out. Heating up another player..."
					);
					const target_player = uno_players.next_player;
					uno_players.game_channel.send(
						`You heated up ${target_player.user}.`
					);
					uno_players.attack(2, target_player);

					collector.stop();
					resolve(); // Resolve the promise when the condition is met
				}
			});
		});
		await extreme_heat_promise;
	},
};
