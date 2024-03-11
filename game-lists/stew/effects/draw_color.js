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
for (const value of color_map.keys()) {
	color_keys.push(value);
}
for (const value of color_map.values()) {
	color_values.push(value.toLowerCase());
}

module.exports = {
	name: `+c`,
	text: `Draw Color`,
	draw_stackable: true,
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
				uno_players.draw_stack++;
				while (
					uno_players.drawpile[
						uno_players.drawpile.length - uno_players.draw_stack
					]?.color != color &&
					color_map.get(
						uno_players.drawpile[
							uno_players.drawpile.length - uno_players.draw_stack
						]?.color
					) != color
				) {
					console.log(
						`Deck card color: ${
							uno_players.drawpile[
								uno_players.drawpile.length -
									uno_players.draw_stack
							]?.color
						}`
					);
					console.log(`Color selected: ${color}`);
					uno_players.draw_stack++;
				}
				await uno_players.game_channel.send(
					`${uno_players.next_player.user} will now draw ${uno_players.draw_stack} cards.`
				);
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
