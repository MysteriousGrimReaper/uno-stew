const color_map = new Map();
const wait = require("node:timers/promises").setTimeout;
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
for (const value of color_map.keys()) {
	color_keys.push(value);
}
for (const value of color_map.values()) {
	color_values.push(value.toLowerCase());
}

module.exports = {
	name: `+cr`,
	text: `Color Roulette`,
	async effect({ uno_players }) {
		uno_players.step();
		await uno_players.game_channel.send({
			content: `${uno_players.current_player.user}, choose a color to draw.`,
		});
		const color_promise = new Promise((resolve) => {
			console.log(`Awaiting response`);
			const filter = (m) =>
				m.author.id === uno_players.current_player.user.id &&
				(color_keys.includes(m.content.toLowerCase()) ||
					color_values.includes(m.content.toLowerCase())); // Only collect messages from the author of the command
			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
				max: 1,
			});
			collector.on("collect", async (collectedMessage) => {
				const color = collectedMessage.content;
				const public_cards_message =
					await uno_players.game_channel.send(
						`${uno_players.current_player.user} will draw the following cards:\n`
					);
				const cards_drawn = [];
				while (
					cards_drawn[0].color != color &&
					color_map.get(cards_drawn[0]?.color) != color
				) {
					cards_drawn.unshift(uno_players.drawpile.pop());
					await public_cards_message.edit(
						`${
							uno_players.current_player.user
						} will draw the following cards:\n- ${cards_drawn
							.map((c) => c.text)
							.join(`\n- `)}`
					);
					await wait(500);
				}
				uno_players.current_player.hand.push(...cards_drawn);
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
					resolve();
				}
			});
		});
		await color_promise;
	},
};
