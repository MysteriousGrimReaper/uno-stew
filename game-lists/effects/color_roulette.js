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
const color_index = new Map();
color_index.set("r", 0xe01414);
color_index.set("b", 0x1447e0);
color_index.set("g", 0x31f51b);
color_index.set("y", 0xdee609);
color_index.set("m", 0x6909e6);
color_index.set("o", 0xfa7507);
color_index.set("p", 0xe609d4);
color_index.set("s", 0xc0c0c0);
color_index.set("i", 0xfffff0);
color_index.set("a", 0xffbf00);
color_index.set("w", 0x2e2e2e);
const {
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");
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
	wild: true,
	level: 4,
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
						`${uno_players.current_player.name} will draw the following cards:\n`
					);
				const cards_drawn = [];
				while (
					cards_drawn[0]?.color != color &&
					color_map.get(cards_drawn[0]?.color) != color
				) {
					cards_drawn.unshift(uno_players.drawpile.pop());
					const pdraw_embed = new EmbedBuilder()
						.setTitle(`Looking for: ${color_map.get(color)}`)
						.setDescription(
							`- ` +
								cards_drawn
									.map((c) => c.text)
									.reverse()
									.join(`\n- `)
						)
						.setFooter({ text: `${cards_drawn.length} cards` })
						.setColor(color_index.get(cards_drawn[0]?.color));
					await public_cards_message.edit({
						content: `${uno_players.current_player.name} will draw the following cards:`,
						embeds: [pdraw_embed],
					});
					await wait(1000);
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
