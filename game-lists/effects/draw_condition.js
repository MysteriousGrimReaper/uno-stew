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
			card.icon[0] == `+` || [5, 6, 7, 8].includes(parseInt(card.icon))
	),
	new Condition(
		`Gas Food Lodging`,
		`Draw until you get a 2, 5, or 7 card.`,
		(card) => [2, 5, 7].includes(parseInt(card.icon))
	),
	new Condition(`Star`, `Draw until you get a 6, 7, 8, or 9 card.`, (card) =>
		[6, 7, 8, 9].includes(parseInt(card.icon))
	),
	new Condition(
		`Big Bang Theory Kitty`,
		`Draw until you get a 0, 3, 5, or 9 card.`,
		(card) => [0, 3, 5, 9].includes(parseInt(card.icon))
	),
	new Condition(
		`Wishing Star`,
		`Draw until you get a purple, pink, orange, or blue card.`,
		(card) => [`b`, `p`, `m`, `o`].includes(card.color)
	),
	new Condition(
		`Just Keep Swimming`,
		`Draw until you get a blue card.`,
		(card) => [`b`].includes(card.color)
	),
	new Condition(
		`Hadouken`,
		`Draw until you get a card with the ability to skip or reverse the turn order.`,
		(card) => [`sk`, `sk2`, `re`, `ske`, `rsk`, `da`].includes(card.icon)
	),
];
module.exports = {
	name: `+x`,
	text: `Draw Condition`,
	wild: true,
	level: 4,
	async effect({ uno_players }) {
		const condition =
			conditions[Math.floor(Math.random() * conditions.length)];
		await uno_players.game_channel.send({
			content: `Your condition is: **${condition.name}**.\n${condition.desc}`,
		});
		let cards_drawn = 1;
		let card =
			uno_players.drawpile[uno_players.drawpile.length - cards_drawn];
		while (!condition.effect(card)) {
			cards_drawn++;
			card =
				uno_players.drawpile[uno_players.drawpile.length - cards_drawn];
		}
		await uno_players.next_player.draw(uno_players.drawpile, cards_drawn);
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
	},
};
