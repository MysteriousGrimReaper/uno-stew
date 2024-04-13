const color_map = new Map();
color_map.set("r", "Red");
color_map.set("b", "Blue");
color_map.set("g", "Green");
color_map.set("y", "Yellow");
color_map.set("m", "Magenta");
color_map.set("p", "Pink");
color_map.set("o", "Orange");
color_map.set("s", "Silver");
color_map.set("a", "Amber");
color_map.set("i", "Ivory");
const color_keys = [];
const color_values = [];
const wait = require("node:timers/promises").setTimeout;
for (const value of color_map.keys()) {
	color_keys.push(value);
}
for (const value of color_map.values()) {
	color_values.push(value.toLowerCase());
}

module.exports = {
	name: `+c`,
	text: `Draw Color`,
	async effect({ uno_players, player }) {
		await uno_players.game_channel.send({
			content: `Choose a color for the next player to draw.`,
		});
		const color_promise = new Promise((resolve) => {
			console.log(`Awaiting response`);
			const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command
			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
			});
			collector.on("collect", async (collectedMessage) => {
				if (
					!(
						color_keys.includes(
							collectedMessage.content.toLowerCase()
						) ||
						color_values.includes(
							collectedMessage.content.toLowerCase()
						)
					)
				) {
					console.log(`did not include color`);
					return;
				}
				const color = collectedMessage.content;
				let card_drawn = await uno_players.next_player.draw(uno_players.drawpile, 1)[0]
				while (
					card_drawn.color != color &&
					color_map.get(card_drawn.color) != color
				) {
					await wait(500)
					card_drawn = await uno_players.next_player.draw(uno_players.drawpile, 1)[0]
				}
				collector.stop();
				resolve();
			});

			collector.on("end", (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send(
						"You timed out, the color chosen will be red."
					);
					const color = `r`;
					uno_players.draw_stack++;
					while (
						uno_players.drawpile[
							uno_players.length - uno_players.draw_stack
						].color != color
					) {
						uno_players.draw_stack++;
					}
					collector.stop();
					resolve();
				}
			});
		});
		await color_promise;
	},
};
