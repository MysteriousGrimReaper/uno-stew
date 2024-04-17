/* eslint-disable no-mixed-spaces-and-tabs */
const wait = require("node:timers/promises").setTimeout;
const {
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");
const { color_map, icon_map, emoji_map, color_keys } = require(`./maps.js`);
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
	get flex() {
		return this.front.flex;
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
	set flex(f) {
		this.front.flex = f;
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
	hand_text(player_manager) {
		const playable = this.playable_piles(player_manager, true).reduce(
			(acc, cv) => acc || cv,
			false
		);
		return (
			(playable ? `**` : ``) +
			this.front.hand_text +
			(playable ? `**` : ``)
		);
	}
	get back_text() {
		return this.back.text;
	}
	playable_piles(player_manager, current_player_flag = false) {
		return this.front.playable_piles(player_manager, current_player_flag);
	}
}
/**
 * Represents a card's face.
 * @param {String} icon The card number or symbol. Cards with matching icons can be matched together.
 * @param {String} color The card's colour. Cards with matching colors can be matched together.
 * @param {Array} modifiers The modifiers(s) that the card has. All modifierss are strings.
 */
class CardFace {
	constructor({ icon, color, modifiers, flex = false }) {
		this.modifiers = modifiers ?? []; // what modifiers(s) the card has (array)
		this.icon = icon ?? ``; // card number or symbol (string)
		this.color = color; // card colour (string)

		const possible_flex_color_array = color_keys
			.toSpliced(color_keys.indexOf(color), 1)
			.toSpliced(-1);
		this.flex =
			this.color == `w`
				? false
				: flex
				? flex
				: Math.random() < 0.1
				? possible_flex_color_array[
						Math.floor(
							Math.random() * possible_flex_color_array.length
						)
				  ]
				: false;
		this.wild_colors =
			this.color == `w`
				? shuffleArray(color_keys.filter((c) => c != `w`)).slice(6)
				: [];
		this.emoji = emoji_map.get(this.color);
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
			`${this.color}${this.icon}`.toLowerCase() +
				(this.flex ? `.f` + this.flex : ``),

			this.text,
			this.text.toLowerCase(),
		];
		this.hand_text = `${this.aliases[1]} (${this.aliases[0]})`;
	}
	playable_piles(player_manager, current_player_flag = false) {
		const card_to_play = structuredClone(this);
		const dpiles = player_manager.drawpile.discardpiles;
		return dpiles.map((dp) => {
			const card = structuredClone(dp.top_card);
			return (
				player_manager.playable_on({
					card_to_play,
					card,
					pile_chosen: dp,
					current_player_flag,
				}) == true
			);
		});
	}

	/**
	 *
	 * @returns The text information of a card.
	 */
	get text() {
		let card_text = ``;
		if (!this.color) {
			return ``;
		}
		const color_name = color_map.get(this.color) ?? this.color;
		card_text += `${color_name}` ?? ``;
		const icon_name = icon_map.get(this.icon) ?? this.icon;
		card_text += ` ${icon_name}`;
		card_text +=
			this.modifiers.length > 0
				? ` (+ ${this.modifiers.join(`, `)})`
				: ``;
		card_text += this.flex ? ` (Flex ${color_map.get(this.flex)})` : ``;
		return card_text.trim();
	}
}
/**
 * Represents an UNO player.
 *
 * @param {User} user A Discord User object.
 */
class Player {
	constructor(user, interaction) {
		this.user = user; // discord user
		this.hand = new Hand(); // Hand
		this.uno_callable = false; // boolean
		this.towers = [];
		this.character;
		this.pizza = 1;
		this.drawpile;
		this.popcorn = 1;
		this.member = interaction.guild.fetch(user.id);
	}
	/**
	 * Returns the player's user ID.
	 */
	get id() {
		return this.user.id;
	}
	get init_hand_embed() {
		const avatar = this.user.displayAvatarURL();
		return new EmbedBuilder()
			.setTitle(`Your hand:`)
			.setDescription(`${this.hand.init_text}`)
			.setAuthor({
				name: this.user.username,
				iconURL: avatar,
			})
			.setFooter({
				text: `${this.hand.length} cards | ${`🍕`.repeat(
					this.pizza
				)} | ${`🍿`.repeat(this.popcorn)}`,
			});
	}
	hand_embed(player_manager) {
		const avatar = this.user.displayAvatarURL();
		return new EmbedBuilder()
			.setTitle(`Your hand:`)
			.setDescription(`${this.hand.text(player_manager)}`)
			.setAuthor({
				name: this.user.username,
				iconURL: avatar,
			})
			.setFooter({
				text: `${this.hand.length} cards | ${`🍕`.repeat(
					this.pizza
				)} | ${`🍿`.repeat(this.popcorn)}`,
			})
			.setColor(
				this.hand.length < 10
					? 0x55ff55
					: this.hand.length < 18
					? 0xdddd55
					: 0xdd5555
			);
	}
	/**
	 * For pizza stealing.
	 * @param {Player} player The player to steal a slice of pizza from.
	 * @returns
	 */
	async steal(player) {
		if (player.pizza <= 0) {
			await player.draw(player.drawpile, 1);
			return;
		}
		this.pizza++;
		player.pizza--;
		return this;
	}
	/**
	 * Makes the player draw a certain number of cards.
	 * @param {DrawPile} drawpile Which DrawPile should the player draw from?
	 * @param {Number} number How many cards does the player draw? (Default: 1)
	 * @returns
	 */
	async draw(drawpile = this.drawpile, number = 1) {
		const cards_drawn = [];
		for (let i = 0; i < number; i++) {
			cards_drawn.push(drawpile.draw(this));
		}
		if (this.hand.length == 1) {
			this.uno_callable = true;
		} else {
			this.uno_callable = false;
		}
		const draw_embed = new EmbedBuilder()
			.setTitle(`You drew the following card(s):`)
			.setDescription(cards_drawn.map((c) => c.text).join(`\n- `))
			.setColor(Math.round(0xffffff / cards_drawn.length));
		await this.user.send({ embeds: [draw_embed] });
		return cards_drawn;
	}
	/**
	 * Plays a card from the player's hand, activating its effect.
	 * @param {string} card Text of the card being played.
	 * @param {DiscardPile} discardpile The discard pile to play the card on.
	 */
	play(card, discardpile) {
		card.player = this;
		discardpile.push(this.hand.remove_card(card));
		card.flex = false;
		if (this.hand.length == 1) {
			this.uno_callable = true;
		} else {
			this.uno_callable = false;
		}
	}
	discard(card, discardpile) {
		card.player = this;
		discardpile.push(this.hand.remove_card(card));
		card.flex = false;

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
	get init_text() {
		return `- ${this.map((card) => {
			return card.text;
		}).join(`\n- `)}`;
	}
	get default_text() {
		return `- ${this.map((card) => {
			return card.text;
		}).join(`\n- `)}`;
	}
	text(player_manager) {
		return `- ${this.map((card) => {
			return card.hand_text(player_manager);
		}).join(`\n- `)}`;
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
		const new_card = this.pop();
		new_card.flex = false;
		this.discardpiles[discardpileindex].push(new_card);
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
				.map((pile) => pile.top_card.color)
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
			.map((dp, index) => {
				return {
					name: `Dish ${index + 1}`,
					value: `${dp.top_card.emoji} ${dp.top_card.text} ${
						!dp.active ? `🚫` : ``
					}`,
				};
			})
			.map((d) => `${d.name}: **${d.value}**`)
			.join(`\n`);
	}
	get table_embed() {
		const dishes = this.discardpiles.map((dp, index) => {
			return {
				name:
					`Dish ${index + 1}` +
					`${!dp.active ? ` 🚫` : ``}` +
					`${dp.top_card.icon == `ov` ? ` ⚠️` : ``}`,
				value: `${dp.top_card.emoji} ${dp.top_card.text}`,
			};
		});
		return new EmbedBuilder()
			.setTitle(`Table:`)
			.setColor(0x888888)
			.addFields(...dishes);
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
		this.effect_list = [];
		this.popcorn_users = [];
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
			this.attack_counter = 0;
			await this.game_channel.send(
				`The oven has **overheated**! It spews out **${cards_drawn}** card(s) for ${roller.user}.`
			);
			await roller.draw(this.drawpile, cards_drawn);
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
		await 500;
		return false;
	}
	get current_user() {
		return this.current_player.user;
	}
	get current_player() {
		return this[this.current_turn_index];
	}
	load(player_list, interaction) {
		this.push(
			...player_list.map((user) => {
				return new Player(user, interaction);
			})
		);
		return this;
	}
	setGameInfo(interaction) {
		this.game_channel = interaction.channel;
		const guild = interaction.guild;
		this.forEach(
			async (player) =>
				(player.member = await guild.members.fetch(player.user.id))
		);
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
	setEffectList(effect_list) {
		this.effect_list = effect_list;
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
		if (this.length == 2) {
			this.step();
		}
		return this;
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
		const pings = this.user_map
			.map((user) => `<@${user.id}>`)
			.indexOf(name);
		return this[Math.max(usernames, globalNames, pings)];
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
	/**
	 * Check if this card is playable on a given card.
	 * @param {CardFace} card
	 * @returns true if the card is playable
	 */
	playable_on({
		card_to_play,
		jump_in = false,
		current_player_flag = false,
		pile_chosen = undefined,
		source = undefined,
	}) {
		const card = pile_chosen.top_card;
		if (!card) {
			return false;
		}
		const effect_list = this.effect_list;
		const effect =
			effect_list[
				effect_list.map((e) => e.name).indexOf(card_to_play.icon)
			];
		const card_match_bypass = effect?.card_match_bypass ?? false;
		const draw_stackable = effect?.draw_stackable;
		const clear_flag = card_to_play.icon == `cl`;
		const wild_match = card.color == `w` || card_to_play.color == `w`;
		const color_match = card.color == card_to_play.color;
		const icon_match = card.icon == card_to_play.icon;
		const jump_in_flag = (color_match && icon_match && jump_in) || !jump_in;
		const normal_flag = wild_match || color_match || icon_match;
		let wild_number_change_flag = false;
		if (
			!normal_flag &&
			card_to_play.icon == `wn` &&
			/^[0-9]$/.test(card?.icon)
		) {
			card_to_play.icon = card.icon;
			wild_number_change_flag = true;
		}
		const draw_number_flag =
			parseInt(card_to_play?.icon?.slice(1)) >=
				parseInt(card?.icon?.slice(1)) &&
			card.icon[0] == card_to_play.icon[0] &&
			card.icon[0] == `+`;
		const draw_state = this.draw_stack > 0;
		const draw_state_flag = !draw_state || (draw_stackable && draw_state);
		const ono_99_flag = card_to_play.icon == `99`;
		const flex_flag = card_to_play.flex == card?.color;
		const inactive_pile_flag = !pile_chosen?.active;
		const inactive_pile_bypass = effect?.inactive_pile_bypass;
		const overload = card.icon == `ov`;
		if (!current_player_flag && !jump_in) {
			return `not player's turn`;
		}
		if (jump_in && !jump_in_flag) {
			return `failed jump-in`;
		}
		if (jump_in && jump_in_flag) {
			return `jump-in`;
		}
		if (inactive_pile_flag && !inactive_pile_bypass) {
			console.log(pile_chosen);
			return `inactive`;
		}
		if (!draw_state_flag) {
			return `not draw stackable`;
		}
		if (ono_99_flag) {
			return `ono`;
		}
		if (flex_flag) {
			return `flex`;
		}
		if (overload && !clear_flag) {
			return `overload`;
		}
		// console.log(`top card:`);
		// console.log(card);
		// console.log(`chosen card:`);
		// console.log(card_to_play);
		return (
			(normal_flag ||
				draw_number_flag ||
				clear_flag ||
				wild_number_change_flag ||
				card_match_bypass) &&
			jump_in_flag
		);
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
