const path = require("path");
const dir = `C:/Users/A/Documents/GitHub/uno-stew/uno-stew`;
const stew_path = path.join(dir, `/game-lists/stew`);
const {
	color_map,
	icon_map,
	emoji_map,
	special_emoji_map,
	color_keys,
} = require(path.join(stew_path, `/maps.js`));
/**
 * Shuffles the array.
 * @param {Array} array
 * @returns This modifies the original array.
 */
function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}
/**
 * Shuffles the array.
 * @param {Array} array
 * @returns This does not modify the original array.
 */
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

/**
 * Represents a card object, with a front and back side.
 *
 * @param {CardFace} front The front of the card.
 * @param {CardFace} back The back of the card. (For Uno Flip)
 */
class Card {
	constructor(front, back = null) {
		this.front = front;
		this.back = back;
	}
	get color() {
		return this.front.color;
	}
	get icon() {
		return this.front.icon;
	}
	get emoji() {
		return this.front.emoji;
	}
	get modifiers() {
		return this.front.modifiers;
	}
	set color(c) {
		this.front.color = c;
	}
	set icon(i) {
		this.front.icon = i;
	}
	set modifiers(m) {
		this.front.modifiers = m;
	}
	/**
	 * Flips the card to the back side.
	 */
	flip() {
		[this.front, this.back] = [this.back, this.front];
	}
	get text() {
		return this.front.text;
	}
	get hand_text() {
		return this.front.hand_text;
	}
	get back_text() {
		return this.back.text;
	}
}
/**
 * Represents a card's face.
 * @param {String} icon The card number or symbol. Cards with matching icons can be matched together.
 * @param {String} color The card's colour. Cards with matching colors can be matched together.
 * @param {Array} modifiers The modifiers(s) that the card has. All modifierss are strings.
 */
class CardFace {
	constructor({ icon, color, modifiers }) {
		this.modifiers = modifiers ?? []; // what modifiers(s) the card has (array)
		this.icon = icon ?? ``; // card number or symbol (string)
		this.color = color; // card colour (string)
		this.wild_colors =
			this.color == `w`
				? shuffleArray(color_keys.filter((c) => c != `w`)).slice(6)
				: [];
		this.emoji = /^\d+$/.test(icon)
			? emoji_map.get(this.color)
			: special_emoji_map.get(this.color);
		// r: red
		// b: blue
		// g: green
		// y: yellow
		// m: magenta
		// p: pink
		// o: orange
		// s: silver (gray)

		this.aliases = [
			// all ways to refer to the card
			`${this.color}${this.icon}`.toLowerCase(),
			this.text,
			this.text.toLowerCase(),
		];
		this.hand_text = `${this.aliases[1]} (${this.aliases[0]})`;
	}
	/**
	 *
	 * @returns The text information of a card.
	 */
	get text() {
		let card_text = ``;
		const color_name = color_map.get(this.color) ?? this.color;
		card_text += `${color_name} ` ?? ``;
		const icon_name = icon_map.get(this.icon) ?? this.icon;
		card_text += `${icon_name} `;
		card_text +=
			this.modifiers.length > 0
				? ` (+ ${this.modifiers.join(`, `)})`
				: ``;
		return card_text.trim();
	}
}
/**
 * Represents an UNO player.
 *
 * @param {User} user A Discord User object.
 */
class Player {
	constructor(user) {
		this.user = user; // discord user
		this.hand = new Hand(); // Hand
		this.uno_callable = false; // boolean
		this.towers = [];
		this.character;
	}
	/**
	 * Returns the player's user ID.
	 */
	get id() {
		return this.user.id;
	}
	/**
	 * Makes the player draw a certain number of cards.
	 * @param {DrawPile} drawpile Which DrawPile should the player draw from?
	 * @param {Number} number How many cards does the player draw? (Default: 1)
	 * @returns
	 */
	async draw(drawpile, number = 1) {
		const cards_drawn = [];
		for (let i = 0; i < number; i++) {
			cards_drawn.push(drawpile.draw(this));
		}
		if (this.hand.length == 1) {
			this.uno_callable = true;
		} else {
			this.uno_callable = false;
		}
		await this.user.send(
			`You drew the following card(s):\n- ${cards_drawn
				.map((c) => c.text)
				.join(`\n- `)}`
		);
		return cards_drawn;
	}
	/**
	 * Plays a card from the player's hand, activating its effect.
	 * @param {string} card Text of the card being played.
	 * @param {DiscardPile} discardpile The discard pile to play the card on.
	 */
	play(card, discardpile) {
		discardpile.push(this.hand.remove_card(card));

		if (this.hand.length == 1) {
			this.uno_callable = true;
		} else {
			this.uno_callable = false;
		}
	}
	discard(card, discardpile) {
		discardpile.push(this.hand.remove_card(card));

		if (this.hand.length == 1) {
			this.uno_callable = true;
		} else {
			this.uno_callable = false;
		}
	}
	discard_color(color, discardpile) {
		for (let i = 0; i < this.hand.length; i++) {
			while (this.hand[i]?.front?.color == color) {
				this.play(this.hand[i], discardpile);
			}
		}
	}
}
/**
 * Represents a hand which contains cards.
 */
class Hand extends Array {
	add_card(card) {
		this.push(card);
	}
	/**
	 *
	 * @param {Card} card The card to remove.
	 * @returns The removed card.
	 */
	remove_card(card) {
		// console.log(card);
		return this.splice(this.indexOf(card), 1)[0];
	}
	remove_card_by_index(index) {
		// console.log(card);
		return this.splice(index, 1)[0];
	}
	check_for_card(card_text) {
		return this.find((card_in_hand) => {
			return card_in_hand.front.aliases.includes(card_text.toLowerCase());
		});
	}
	get text() {
		return `- ${this.map((card) => card.hand_text).join(`\n- `)}`;
	}
	get back_text() {
		return `- ${this.map((card) => card.back_text).join(`\n- `)}`;
	}
	flip() {
		this.forEach((card) => card.flip());
	}
}
/**
 * Represents a pile from which players draw from.
 */
class DrawPile extends Array {
	constructor() {
		super();
		this.currently_inactive_discard_pile = 0;
		this.discardpiles = [];
	}
	activate_all_discard_piles() {
		this.discardpiles.forEach((dp) => (dp.active = true));
		return this;
	}
	set_inactive_discard_pile(index) {
		this.discardpiles[index].active = false;
		return this;
	}
	set_new_inactive_discard_pile(index) {
		this.activate_all_discard_piles();
		this.set_inactive_discard_pile(index);
		return this;
	}
	update_discard_pile() {
		this.set_new_inactive_discard_pile(
			this.currently_inactive_discard_pile
		);
		return this;
	}
	least_active_discard_pile() {
		let i = 0;
		while (!this.discardpiles[i].active) {
			i++;
		}
		return i;
	}
	draw(player) {
		if (this.length == 0) {
			this.reshuffle();
		}
		const card_drawn = this.pop();
		player.hand.add_card(card_drawn);
		return card_drawn;
	}
	addDiscardPile(discardpile) {
		this.discardpiles.push(discardpile);
	}
	discard(discardpileindex) {
		this.discardpiles[discardpileindex].push(this.pop());
	}
	reshuffle() {
		this.discardpiles.forEach((pile) => {
			while (pile.length > 1) {
				this.push(pile.shift());
			}
			shuffle(this);
		});
	}
	flip() {
		this.forEach((card) => card.flip());
		for (let i = 0; i < this.length; i++) {
			[this[i], this[this.length - i - 1]] = [
				this[this.length - i - 1],
				this[i],
			];
		}
		this.discardpiles.forEach((dp) => dp.flip());
	}
	check_match() {
		return this.check_match_color() || this.check_match_icon();
	}
	check_match_color() {
		return (
			this.discardpiles
				.map((pile) => pile.top_card.front.color)
				.reduce((acc, cv) => (acc == cv ? cv : false)) != false
		);
	}
	check_match_icon() {
		return (
			this.discardpiles
				.map((pile) => pile.top_card.front.icon)
				.reduce((acc, cv) => (acc == cv ? cv : false)) != false
		);
	}
	get discard_pile_text() {
		return this.discardpiles
			.map(
				(dp, i) =>
					`- ${!dp.active ? `~~` : ``}Dish ${i + 1}: **${
						dp.top_card.text
					}**${!dp.active ? `~~` : ``}`
			)
			.join(`\n`);
	}
	load(card_deck) {
		const load_deck = card_deck;
		shuffle(load_deck);
		const card_deck_front = load_deck.slice(0, load_deck.length / 2);
		const card_deck_back = load_deck.slice(
			load_deck.length / 2,
			load_deck.length
		);

		this.push(
			...card_deck_front.map(
				(card, index) =>
					new Card(
						new CardFace({
							icon: card.icon,
							color: card.color,
							modifiers: card.modifiers,
						}),
						new CardFace({
							icon: card_deck_back[index].icon,
							color: card_deck_back[index].color,
							modifiers: card_deck_back[index].modifiers,
						})
					)
			)
		);
		this.card_shuffle();
		return this;
	}
	card_shuffle() {
		shuffle(this);
	}
	get top_card() {
		return this[this.length - 1];
	}
}
/**
 * Represents a pile to which players place cards upon.
 */
class DiscardPile extends Array {
	constructor() {
		super();
		this.active = true;
	}
	flip() {
		this.forEach((card) => card.flip());
		for (let i = 0; i < this.length; i++) {
			[this[i], this[this.length - i - 1]] = [
				this[this.length - i - 1],
				this[i],
			];
		}
	}
	remove_card(card_text) {
		return this.splice(
			this.findIndex((card_in_pile) =>
				card_in_pile.front.aliases.includes(card_text)
			),
			1
		)[0];
	}
	get top_card() {
		return this[this.length - 1];
	}
}

/**
 * Manages all the players.
 */
class PlayerManager extends Array {
	constructor() {
		super();
		this.current_turn_index = 0;
		this.play_direction = 1;
		this.draw_stack = 0;
		this.input_state = false;
		this.winners_list = [];
		this.losers_list = [];
		this.attack_counter = 1;
	}
	/**
	 * Dials up the oven (Attack d10).
	 * @param {Number} strength By how many faces should the die turn? (Default: 1)
	 * @param {Player} roller Who is rolling? (Default: current turn)
	 * @returns true if the oven activates, false otherwise
	 */
	async attack(strength = 1, roller = this[this.current_turn_index]) {
		this.attack_counter += strength;
		const emoji_counter =
			`🔥`.repeat(this.attack_counter) +
			`▪️`.repeat(Math.max(0, 10 - this.attack_counter));
		if (this.attack_counter >= 10) {
			const cards_drawn = Math.ceil(Math.random() * 10);
			await this.game_channel.send(
				`The oven has **overheated**! ${roller.user} draws ${cards_drawn} cards.`
			);
			await roller.draw(this.drawpile, cards_drawn);
			this.attack_counter = 1;
			return true;
		}
		await this.game_channel.send(
			`${
				roller.user.globalName ?? roller.user.username
			} turns up the heat. ${
				this.attack_counter < 3
					? `The oven is **warm**. ${emoji_counter}`
					: this.attack_counter < 5
					? `The oven is **hot**. ${emoji_counter}`
					: this.attack_counter < 7
					? `The oven is **roasting**. ${emoji_counter}`
					: this.attack_counter < 9
					? `The oven is **blazing**. ${emoji_counter}`
					: `The oven is **infernal**. ${emoji_counter}`
			}`
		);
		return false;
	}
	get current_user() {
		return this.current_player.user;
	}
	get current_player() {
		return this[this.current_turn_index];
	}
	load(player_list) {
		this.push(
			...player_list.map((user) => {
				return new Player(user);
			})
		);
		return this;
	}
	setGameInfo(interaction) {
		this.game_channel = interaction.channel;
		return this;
	}
	setMainDrawPile(drawpile) {
		this.drawpile = drawpile;
		return this;
	}
	setWildDrawPile(drawpile) {
		this.wild_drawpile = drawpile;
		return this;
	}
	/**
	 * Returns the next player.
	 */
	get next_player() {
		return this[
			(this.current_turn_index + 1 * this.play_direction + this.length) %
				this.length
		];
	}
	/**
	 * Goes to the next player.
	 * @param back Whether or not to go backwards. (false by default)
	 */
	step(back = false) {
		this.current_turn_index +=
			this.play_direction * (back ? -1 : 1) + this.length;
		this.current_turn_index %= this.length;
		return this;
	}
	/**
	 * Reverses the turn order.
	 */
	reverse() {
		this.play_direction *= -1;
	}
	/**
	 * Returns all the users
	 */
	get user_map() {
		return this.map((player) => player.user);
	}
	/**
	 * Returns the user ids
	 */
	get id_map() {
		return this.user_map.map((user) => user.id);
	}
	/**
	 * Find a player based on their user id.
	 * @param {String} id The user ID.
	 */
	find_player(id) {
		const index = this.id_map.indexOf(id);
		console.log(this[index]);
		return this[index];
	}
	/**
	 * Find a player based on their name.
	 * @param {String} name The username/globalName.
	 */
	find_player_by_name(name) {
		const usernames = this.user_map
			.map((user) => user.username)
			.indexOf(name);
		const globalNames = this.user_map
			.map((user) => user.globalName?.toLowerCase())
			.indexOf(name);
		return this[Math.max(usernames, globalNames)];
	}
	/**
	 * Remove a player based on their user id.
	 * @param {String} id The user ID.
	 */
	remove_player(id) {
		console.log(this.id_map);
		if (this.id_map.indexOf(id) < 0) {
			console.log(`Could not find user with id ${id}`);
			return;
		}
		this.splice(this.id_map.indexOf(id), 1);
		this.step(true);
		return this;
	}
	add_winner(id) {
		this.winners_list.push(this.find_player(id));
		this.remove_player(id);
	}
	add_loser(id) {
		this.losers_list.push(this.find_player(id));
		this.remove_player(id);
	}
	/**
	 * Remove the current player.
	 */
	remove_current_player() {
		this.splice(this.current_player_index, 1);
		this.step(true);
	}
}

module.exports = {
	Player,
	PlayerManager,
	DiscardPile,
	DrawPile,
	Card,
	CardFace,
	Hand,
	shuffle,
};
