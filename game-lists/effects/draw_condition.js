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
class Condition {
	/**
	 *
	 * @param {String} name The name of the effect.
	 * @param {String} desc The description of the draw.
	 * @param {Function} effect The effect function. Returns true when a card is found.
	 */
	constructor(name, desc, effect) {
		this.name = name;
		this.desc = desc;
		this.effect = effect;
	}
}
const conditions = [
	new Condition(
		`Cash`,
		`Draw until you get a green card.`,
		(card) => card.color == `g`
	),
	new Condition(
		`Boogie`,
		`Draw until you get a 5, 6, 7, 8, or draw card.`,
		(card) =>
			card.icon[0] == `+` ||
			(parseInt(card.icon) >= 5 && parseInt(card.icon) <= 8)
	),
];
module.exports = {
	name: `+x`,
	text: `Draw Condition`,
	wild: true,
	level: 4,
	async effect({ uno_players, player }) {
		await uno_players.game_channel.send({
			content: `Choose a color for the next player to draw.`,
		});
		const color_promise = new Promise((resolve) => {
			console.log(`Awaiting response`);
			const filter = (m) =>
				m.author.id === player.user.id &&
				(color_keys.includes(m.content.toLowerCase()) ||
					color_values.includes(m.content.toLowerCase())); // Only collect messages from the author of the command
			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 60000,
				max: 1,
			});
			let cards_drawn = 1;
			collector.on("collect", async (collectedMessage) => {
				await uno_players.game_channel.send(`*Drawing cards...*`);

				const color = collectedMessage.content;
				let card_color =
					uno_players.drawpile[
						uno_players.drawpile.length - cards_drawn
					].color;
				while (
					card_color != color &&
					color_map.get(card_color) != color
				) {
					cards_drawn++;
					card_color =
						uno_players.drawpile[
							uno_players.drawpile.length - cards_drawn
						].color;
				}
				await uno_players.next_player.draw(
					uno_players.drawpile,
					cards_drawn
				);
				collector.stop();
				await uno_players.game_channel.send(
					`${
						cards_drawn > 18
							? `# `
							: cards_drawn > 12
							? `## `
							: cards_drawn > 6
							? `### `
							: ``
					}${
						uno_players.next_player.user.globalName ??
						uno_players.next_player.user.username
					} drew ${cards_drawn} cards! ${
						cards_drawn >= 25 ? `💥` : cards_drawn >= 10 ? `⚠️` : ``
					}`
				);
				resolve();
			});

			collector.on("end", async (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send("You timed out.");
					resolve();
				}
			});
		});
		await color_promise;
	},
};
