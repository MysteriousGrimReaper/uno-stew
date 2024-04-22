const wait = require("node:timers/promises").setTimeout;
module.exports = {
	name: `50`,
	text: `50/50`,
	level: 3,
	wild: true,
	async effect({ uno_players, player }) {
		let heads;
		let tails;
		await uno_players.game_channel.send(
			`${player.user}, choose a player to be **heads**.`
		);
		const coin_promise = new Promise((resolve) => {
			const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command

			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
			});
			collector.on("collect", async (collectedMessage) => {
				// Check the collected message for the specific condition (e.g., contains a certain word)
				if (heads) {
					tails = uno_players.find_player_by_name(
						collectedMessage.content.toLowerCase()
					);
					if (!tails) {
						return;
					}
				} else {
					heads = uno_players.find_player_by_name(
						collectedMessage.content.toLowerCase()
					);
					if (heads) {
						await uno_players.game_channel.send(
							`Choose a player to be **tails**.`
						);
					}
					return;
				}
				if (!(heads && tails)) {
					return;
				}
				const coin_flip_message = await uno_players.game_channel.send(
					`Flipping coin...\n🪙${heads.user}\n▪️${tails.user}`
				);
				let flips = 2 + Math.ceil(Math.random() * 10);
				let side_index = 0;
				while (flips > 0) {
					flips--;
					await wait(Math.random() * 500 + 500);
					side_index++;
					side_index %= 2;
					coin_flip_message.edit(
						`Flipping coin...${
							side_index == 1
								? `\n🪙${heads.user}\n▪️${tails.user}`
								: `\n▪️${heads.user}\n🪙${tails.user}`
						}`
					);
				}
				await wait(Math.random() * 500 + 500);
				const side = side_index == 1 ? `heads` : `tails`;
				const player_who_draws = side == `heads` ? tails : heads;
				await wait(500);
				await uno_players.game_channel.send(
					`The coin lands **${side}**! ${player_who_draws.user}, draw 4 cards.`
				);
				await player_who_draws.draw(uno_players.drawpile, 4);
				resolve();
			});

			collector.on("end", (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send(
						"You timed out. Effect cancelled."
					);
					collector.stop();
					resolve(); // Resolve the promise when the condition is met
				}
			});
		});
		await coin_promise;
	},
};
