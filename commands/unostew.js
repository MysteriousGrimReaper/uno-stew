/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-case-declarations */
const DEBUG_DECK = true;
const fs = require("fs");
const path = require("path");
const signup_path = `..//tools/signup.js`;
const stew_path = `..//game-lists`;
const { create_signup } = require(signup_path);
const { deck } = require(DEBUG_DECK
	? path.join(stew_path, `/cards.json`)
	: path.join(stew_path, `/default_cards.json`));
const uno_stew_path = `../uno-stew/game-lists`;
const effects_path = path.join(uno_stew_path, `/effects`);
const small_effects_path = path.join(stew_path, `/effects`);
const effect_folder = fs.readdirSync(effects_path);
const effect_list = [];
for (const effect_file of effect_folder) {
	const filePath = path.join(small_effects_path, effect_file);
	const effect = require(filePath);
	effect_list.push(effect);
}
/**
 * List of all effect names.
 */
const effect_names = effect_list.map((eff) => eff.name);
const effect_texts = effect_list.map((eff) => eff.text);
const wait = require("node:timers/promises").setTimeout;
// console.log(effect_names);
const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");
const {
	Player,
	PlayerManager,
	Counter,
	DiscardPile,
	DrawPile,
	Card,
	CardFace,
	Hand,
	shuffle,
} = require(path.join(stew_path, `/classes.js`));
let hand_collect_reply_fn;
const get_hand_collect_reply_fn_stew = () => {
	return hand_collect_reply_fn;
};
const rules_embed = new EmbedBuilder()
	.setTitle(`Uno Stew Rules`)
	.setDescription(
		`https://docs.google.com/document/d/12rInO_Mjnqw0bTIJEw06MAQrpqNmvr-W6N5-pd95UnM/edit?usp=sharing`
	);
module.exports = {
	get_hand_collect_reply_fn_stew,
	data: new SlashCommandBuilder()
		.setName("unostew")
		.setDescription("Starts a game of Uno Stew."),
	async execute(interaction) {
		const game_channel = interaction.channel;
		const player_list = await create_signup({
			interaction,
			game_name: "Uno Stew",
			min_players: 2,
			minutes: 7,
			rules: [rules_embed],
			embed_color: 0xec1e22,
		});
		if (player_list !== null) {
			const hand_button = new ButtonBuilder()
				.setCustomId("unostew_hand")
				.setLabel("Hand")
				.setStyle(ButtonStyle.Primary);
			const table_button = new ButtonBuilder()
				.setCustomId("unostew_table")
				.setLabel("Table")
				.setStyle(ButtonStyle.Secondary);
			const player_button = new ButtonBuilder()
				.setCustomId("unostew_players")
				.setLabel("Players")
				.setStyle(ButtonStyle.Secondary);
			const game_row = new ActionRowBuilder().addComponents(
				hand_button,
				table_button,
				player_button
			);
			const drawpile = new DrawPile().load(deck);
			const wild_drawpile = new DrawPile();
			const discardpile_1 = new DiscardPile();
			const discardpile_2 = new DiscardPile();
			const discardpile_3 = new DiscardPile();
			const discardpile_4 = new DiscardPile();
			drawpile.addDiscardPile(discardpile_1);
			drawpile.addDiscardPile(discardpile_2);
			drawpile.addDiscardPile(discardpile_3);
			drawpile.addDiscardPile(discardpile_4);

			const uno_players = new PlayerManager()
				.load(player_list)
				.setGameInfo(interaction)
				.setMainDrawPile(drawpile)
				.setWildDrawPile(wild_drawpile);
			const user_to_player = (user) => {
				return uno_players.find((player) => player.user.id == user.id);
			};
			uno_players.forEach((player) => {
				player.draw(drawpile, 7);
				player.user.send(`Your hand:\n${player.hand.text}`);
			});
			drawpile.discard(0);
			drawpile.discard(1);
			drawpile.discard(2);
			drawpile.discard(3);
			const filter = (m) => !m.author.bot;
			const message_collector = game_channel.createMessageCollector({
				filter,
			});
			// (hand/table/players) button input processing
			hand_collect_reply_fn = async (i) => {
				const { customId } = i;
				if (!uno_players.map((p) => p.user.id).includes(i.user.id)) {
					await i.reply({
						content: `You aren't in the game...`,
						ephemeral: true,
					});
					return;
				}
				const player = user_to_player(i.user);
				switch (customId) {
					case `unostew_hand`:
						const hand_embed = new EmbedBuilder()
							.setColor(
								player.hand.length <= 8
									? 0x00dd00
									: player.hand.length <= 16
									? 0xdddd00
									: 0xdd0000
							)
							.setTitle(`Your hand (${player.hand.length}):`)
							.setDescription(player.hand.text);
						await i.reply({
							embeds: [hand_embed],
							ephemeral: true,
						});
						break;
					case `unostew_table`:
						const table_embed = new EmbedBuilder()
							.setTitle(`Table:`)
							.setColor(0x888888)
							.addFields(
								...drawpile.discardpiles.map((dp, index) => {
									return {
										name:
											`Dish ${index + 1}` +
											`${
												!dp.active ? ` (inactive)` : ``
											}`,
										value: `${dp.top_card.emoji} ${dp.top_card.text}`,
									};
								})
							);
						await i.reply({
							embeds: [table_embed],
							ephemeral: true,
						});
						break;
					case `unostew_players`:
						await i.reply({
							content: `Current player: ${
								uno_players.current_user.globalName ??
								uno_players.current_user.username
							}\nHere are the hands and statuses of all players:\n${uno_players
								.map(
									(p) =>
										`## ${
											p.user.globalName ?? p.user.username
										}\n${p.hand.back_text}`
								)
								.join(
									`\n`
								)}\nThe turn order is as follows:\n ${uno_players
								.map(
									(p, ci) =>
										(uno_players.current_turn_index == ci
											? `**`
											: ``) +
										(p.user.globalName ?? p.user.username) +
										(uno_players.current_turn_index == ci
											? `**`
											: ``)
								)
								.join(`, `)}.`,
							ephemeral: true,
						});
				}
			};
			let currently_inactive_discard_pile =
				Math.max(1, Math.ceil(Math.random() * 4)) - 1;
			drawpile.set_new_inactive_discard_pile(
				currently_inactive_discard_pile
			);
			// update this to be an embed
			await game_channel.send({
				content: `The first cards are:\n${drawpile.discard_pile_text}.\nIt is now ${uno_players.current_user}'s turn!`,
				components: [game_row],
			});
			// read messages
			message_collector.on(`collect`, async (message) => {
				if (
					message.author.id == `315495597874610178` &&
					message.content == `stop!`
				) {
					message_collector.stop();
					await game_channel.send(`Game stopped.`);
					return;
				}
				if (uno_players.input_state) {
					return;
				}
				const player = user_to_player(message.author);
				const user_index = uno_players
					.map((p) => p.user)
					.indexOf(message.author);
				const current_player_flag =
					user_index == uno_players.current_turn_index;
				switch (message.content.toLowerCase()) {
					case `uno!`:
						if (player.hand.length == 1) {
							player.uno_callable = false;
							await game_channel.send(
								`**UNO!!** ${player.user} has one card left!`
							);
						}
						const uno_callout_player = uno_players.find(
							(p) => p.hand.length == 1 && p.uno_callable
						);
						if (uno_callout_player) {
							await game_channel.send(
								`${uno_callout_player.user} didn't say Uno! Draw 2 cards.`
							);
							uno_callout_player.draw(drawpile, 2);
						}
						break;
				}

				const args = message.content.split(` `);

				// console.log(player.hand);
				const jump_in_flag = args.find(
					(argument) =>
						/^j$/.test(argument) || /^jump$/.test(argument)
				);
				const sum_flag = args.find((argument) =>
					/^sum$/.test(argument)
				);
				const pile_indicator = args.find((argument) =>
					/^d[1-4]$/.test(argument)
				);
				// console.log(args);
				const card_chosen = args.reduce((acc, cv) => {
					if (acc) {
						return acc;
					} else {
						return player.hand.check_for_card(cv);
					}
				}, undefined);
				// console.log(card_chosen);
				const debug_ids = [
					`315495597874610178`,
					`1014413186017021952`,
					`709631847923187793`,
				];
				// end of turn function
				async function end_turn() {
					if (drawpile.check_match()) {
						await game_channel.send(
							`${uno_players.current_user} has escaped the kitchen!`
						);
						uno_players.add_winner(
							`${uno_players.current_user.id}`
						);
					}
					if (uno_players.current_player.hand.length >= 25) {
						await game_channel.send(
							`${uno_players.current_user} has perished to the stew... (25 or more cards)`
						);
						while (uno_players.current_player.hand.length > 0) {
							drawpile.unshift(
								uno_players.current_player.hand.pop()
							);
						}

						uno_players.add_loser(`${uno_players.current_user.id}`);
						// console.log(uno_players);
					}
					currently_inactive_discard_pile =
						Math.max(1, Math.ceil(Math.random() * 4)) - 1;
					drawpile.set_new_inactive_discard_pile(
						currently_inactive_discard_pile
					);
					if (player.hand.length == 1) {
						player.uno_callable = true;
					} else {
						player.uno_callable = false;
					}
					if (uno_players.winners_list.length > 0) {
						await game_channel.send(
							`## Congratulations to ${uno_players.winners_list[0].user} for winning!`
						);
						message_collector.stop();
						return;
					}
					if (uno_players.length == 1) {
						await game_channel.send(
							`## Congratulations to ${uno_players[0].user} for winning!`
						);
						message_collector.stop();
						return;
					}
					uno_players.step();
					// send info
					await game_channel.send({
						content: `${
							uno_players.draw_stack > 0
								? `You have been draw attacked, ${uno_players.current_user}! Type \`draw\` to draw **${uno_players.draw_stack}** cards or stack by playing a draw card with equal or higher value.`
								: `It is now ${
										uno_players.current_user
								  }'s turn! Dish **${
										currently_inactive_discard_pile + 1
								  }** is inactive.\n${drawpile.discardpiles
										.map((dp, index) => {
											return {
												name: `Dish ${index + 1}`,
												value: `${dp.top_card.emoji} ${
													dp.top_card.text
												} ${
													!dp.active
														? ` (inactive)`
														: ``
												}`,
											};
										})
										.map((d) => `${d.name}: **${d.value}**`)
										.join(`\n`)}`
						}`,
						components: [game_row],
					});
					await uno_players.current_player.user.send(
						`Your hand:\n${
							uno_players[uno_players.current_turn_index].hand
								.text
						}`
					);
				}
				/*
				console.log(`message: ${message.content}`);
				console.log(`author: ${message.author.username}`);
				*/
				// debug commands
				if (debug_ids.includes(message.author.id)) {
					// debug command, type "# debug remove" to use
					if (message.content.includes(`debug remove`)) {
						if (!debug_ids.includes(message.author.id)) {
							return;
						}
						const removal_index = parseInt(message.content);
						if (isNaN(removal_index)) {
							return;
						}
						player.hand.remove_card_by_index(removal_index);
						console.log(`removed card at index ${removal_index}`);
						return;
					}
					// debug command, add a card
					if (message.content.includes(`debug addcard`)) {
						try {
							player.hand.push(
								new Card(
									new CardFace(
										JSON.parse(args.slice(2).join(` `))
									),
									new CardFace(
										JSON.parse(args.slice(2).join(` `))
									)
								)
							);
							await game_channel.send(
								`Added card \`${
									player.hand[player.hand.length - 1].text
								}\` to your hand.`
							);
						} catch (error) {
							await player.user.send(
								`An error occurred: ${error}`
							);
						}
					}
				}

				// check your hand
				if (message.content == `hand`) {
					message.author.send({
						content: `Your hand:\n${player.hand.text}`,
						ephemeral: true,
					});
					return;
				}
				// draw a card
				if (
					(message.content.toLowerCase() == `draw` ||
						message.content.toLowerCase() == `d`) &&
					current_player_flag
				) {
					if (uno_players.draw_stack > 0) {
						const draws = await player.draw(
							drawpile,
							uno_players.draw_stack
						);
						// console.log(uno_players.draw_stack);
						await player.user.send(
							`You drew the following (${
								uno_players.draw_stack
							}) cards:\n- ${draws
								.map((card) => card.text)
								.join(`\n- `)}`
						);
						await game_channel.send(
							`${player.user} drew ${uno_players.draw_stack} cards!`
						);
						uno_players.draw_stack = 0;
						await end_turn();
						return;
					}
					player.draw(drawpile, 1);
					await player.user.send(
						`You drew a **${
							player.hand[player.hand.length - 1].text
						}**.`
					);
					await game_channel.send(`${player.user} drew a card.`);
					await end_turn();
					return;
				}
				// check if card exists
				if (!card_chosen) {
					// console.log(`could not find card`);
					return;
				}
				const pile_chosen =
					pile_indicator != undefined
						? drawpile.discardpiles[parseInt(pile_indicator[1]) - 1]
						: drawpile.discardpiles[
								drawpile.discardpiles
									.map((p) => p.top_card)
									.findIndex(
										(d) =>
											d.wild ||
											d.color == card_chosen.color ||
											d.icon == card_chosen.icon
									)
						  ] ?? drawpile.discardpiles[0];
				// console.log(pile_chosen);
				const current_card = pile_chosen.top_card;

				// if user is not in the game
				if (player == undefined || user_index < 0) {
					return;
				}

				// effect processing
				const process_effects = async (symbol) => {
					uno_players.input_state = true;
					await effect_list[effect_names.indexOf(symbol)]?.effect({
						uno_players,
						card_chosen,
						pile_chosen,
						player,
						currently_inactive_discard_pile,
						message,
					});
					uno_players.input_state = false;
				};

				// the jump-in (rule 2, 13) + patience (rule 7)
				if (jump_in_flag) {
					if (!card_chosen) {
						return;
					}
					if (
						!(
							card_chosen.icon == current_card.icon &&
							card_chosen.color == current_card.color
						)
					) {
						await game_channel.send(
							`${player.user} jumped in with the wrong card... draw 1 card.`
						);
						player.draw(drawpile, 1);
						return;
					}
					player.play(card_chosen, pile_chosen);
					await game_channel.send(
						`${
							player.user.globalName ?? player.user.username
						} jumped in with a **${card_chosen.text}**!`
					);
					if (current_player_flag) {
						await game_channel.send(
							`**Patience bonus!** You can play **any** other food on the same dish.`
						);
						const patience_promise = new Promise((resolve) => {
							uno_players.input_state = true;
							const r_filter = (m) =>
								m.author.id === player.user.id; // Only collect messages from the author of the command
							const collector =
								uno_players.game_channel.createMessageCollector(
									{
										filter: r_filter,
										time: 60000,
									}
								);
							collector.on(
								"collect",
								async (collectedMessage) => {
									if (collectedMessage.content == `stop`) {
										collector.stop();
										resolve();
										return;
									}
									const r_args =
										collectedMessage.content.split(` `);
									const new_card_chosen = r_args.reduce(
										(acc, cv) => {
											if (acc) {
												return acc;
											} else {
												return player.hand.check_for_card(
													cv
												);
											}
										},
										undefined
									);
									if (!new_card_chosen) {
										return;
									}
									player.play(new_card_chosen, pile_chosen);
									await uno_players.game_channel.send({
										content: `${
											player.user.globalName ??
											player.user.username
										} played a **${
											new_card_chosen.front.text
										}** on dish ${
											uno_players.drawpile.discardpiles.indexOf(
												pile_chosen
											) + 1
										}.`,
									});
									collector.stop();
									resolve();
								}
							);

							collector.on("end", async (collected) => {
								uno_players.input_state = false;
								if (collected.size === 0) {
									uno_players.game_channel.send(
										"You timed out, playing a random card..."
									);

									await uno_players.game_channel.send({
										content: `${
											player.user.globalName ??
											player.user.username
										} played a **${
											player.hand[0].text
										}** on dish ${
											uno_players.drawpile.discardpiles.indexOf(
												pile_chosen
											) + 1
										}.`,
									});
									player.play(player.hand[0], pile_chosen);
									collector.stop();
									resolve();
								}
							});
						});
						await patience_promise;
					}
					// HOUSE RULE - jump-ins' symbols and modifiers activate
					/*
					await process_effects(card_chosen.icon);
					if (card_chosen.modifiers) {
						card_chosen.modifiers.forEach(
							async (mod) => await process_effects(mod)
						);
					}*/
					return;
				}

				// check if it's the user's turn
				if (!current_player_flag) {
					// console.log(`Not the right turn.`);
					return;
				}

				// check if card is valid
				const wild_flag =
					current_card.color == `w` || card_chosen.color == `w`;
				const color_flag = current_card.color == card_chosen.color;
				const icon_flag = current_card.icon == card_chosen.icon;
				// to-do: find some way to determine whether these things appear on a modifier instead
				const draw_stack_flag = [card_chosen.icon].find((symbol) => {
					if (
						[current_card.icon, ...current_card.modifiers].filter(
							(n) => /^\+\d+/.test(n)
						).length == 0
					) {
						return false;
					}
					function compare_draw(a, b) {
						const value_a = parseInt(a.slice(1));
						const value_b = parseInt(b.slice(1));
						return value_a >= value_b;
					}
					return (
						effect_list[effect_names.indexOf(symbol)]
							?.draw_stackable &&
						(!/^\+\d+/.test(symbol) ||
							compare_draw(symbol, current_card.icon))
					);
				});
				const card_match_bypass = [card_chosen.icon].find(
					(symbol) =>
						effect_list[effect_names.indexOf(symbol)]
							?.card_match_bypass
				);
				if (
					!(
						wild_flag ||
						color_flag ||
						icon_flag ||
						card_match_bypass ||
						draw_stack_flag
					)
				) {
					await game_channel.send(
						`That card cannot be placed there.`
					);

					return;
				}
				const inactive_pile_flag = !pile_chosen.active;
				const inactive_pile_bypass = [
					card_chosen.icon,
					...card_chosen.modifiers,
				].find(
					(symbol) =>
						effect_list[effect_names.indexOf(symbol)]
							?.inactive_pile_bypass
				);
				if (inactive_pile_flag && !inactive_pile_bypass) {
					await game_channel.send(`That dish is currently inactive.`);
					return;
				}
				const draw_stackable =
					effect_list[effect_names.indexOf(card_chosen.icon)]
						?.draw_stackable;
				// console.log(`draw_stackable: ${draw_stackable}`);
				// console.log(`card_chosen:`);
				// console.log(card_chosen);
				if (!draw_stackable && uno_players.draw_stack > 0) {
					await game_channel.send(
						`A draw attack was played upon you! Stack the draws by playing a draw card of equal or higher value, or by using a card's special effect. (If you have no valid cards, type \`draw\` to draw.)`
					);
					return;
				}
				// playing the card
				player.play(card_chosen, pile_chosen);
				await game_channel.send({
					content: `${
						player.user.globalName ?? player.user.username
					} played a **${card_chosen.text}** on dish ${
						drawpile.discardpiles.indexOf(pile_chosen) + 1
					}.`,
				});
				if (player.hand.length == 0) {
					await game_channel.send(
						`${player.user} has escaped the stew!`
					);
					uno_players.add_winner(player.id);
				}
				// where the effects begin

				await process_effects(card_chosen.icon);
				if (card_chosen.modifiers) {
					card_chosen.modifiers.forEach(
						async (mod) => await process_effects(mod)
					);
				}
				await end_turn();
			});
		} else {
			// Game closed due to inactivity
		}
	},
};
