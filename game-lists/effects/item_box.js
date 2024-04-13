/* eslint-disable no-case-declarations */
const { EmbedBuilder } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const cards_button = new ButtonBuilder()
	.setCustomId(`view-cards`)
	.setLabel("Playable Cards")
	.setStyle(ButtonStyle.Primary);
const cards_row = new ActionRowBuilder().addComponents(cards_button);
module.exports = {
	name: `box`,
	text: `Item Box`,
	async effect({ uno_players, pile_chosen, player }) {
		const pile_index =
			uno_players.drawpile.discardpiles.indexOf(pile_chosen);
		uno_players.drawpile.discard(pile_index);
		const game_channel = uno_players.game_channel;
		switch (pile_chosen.top_card.color) {
			case `r`:
				await game_channel.send(
					`You got a **mushroom**! Take another turn.`
				);
				uno_players.step(true);
				break;
			case `g`:
				await game_channel.send(
					`You got a **green shell**! Name a player to make them draw a card.`
				);
				const green_shell_promise = new Promise((resolve) => {
					const filter = (m) =>
						m.author.id === player.user.id &&
						uno_players.find_player_by_name(
							m.content.toLowerCase()
						); // Only collect messages from the author of the command

					const collector =
						uno_players.game_channel.createMessageCollector({
							filter,
							time: 60000,
							max: 1,
						});
					collector.on("collect", async (collectedMessage) => {
						// Check the collected message for the specific condition (e.g., contains a certain word)
						const target_player = uno_players.find_player_by_name(
							collectedMessage.content.toLowerCase()
						);
						if (target_player) {
							await target_player.draw(uno_players.drawpile);
							collector.stop();
							resolve(); // Resolve the promise when the condition is met
						}
					});

					collector.on("end", (collected) => {
						if (collected.size === 0) {
							uno_players.game_channel.send("You timed out.");
							collector.stop();
							resolve(); // Resolve the promise when the condition is met
						}
					});
				});
				await green_shell_promise;
				break;
			case `y`:
				uno_players.step(true);
				await game_channel.send(
					`You got a **banana peel**! ${uno_players.current_player.user} slipped on it and will draw 2 cards.`
				);
				await uno_players.current_player.draw(uno_players.drawpile, 2);
				uno_players.step();
				break;
			case `b`:
				const sorted_players = uno_players.toSorted(
					(p1, p2) => p2.hand.length - p1.hand.length
				);
				await game_channel.send(
					`You got a **blue shell**! ${sorted_players[0].user}, take that!`
				);
				sorted_players[0].draw(
					sorted_players[sorted_players.length - 1].hand.length
				);
				break;
			case `m`:
				await game_channel.send(
					`You got a **red shell**! Name a player to make them draw 3 cards.`
				);
				const red_shell_promise = new Promise((resolve) => {
					const filter = (m) =>
						m.author.id === player.user.id &&
						uno_players.find_player_by_name(
							m.content.toLowerCase()
						); // Only collect messages from the author of the command

					const collector =
						uno_players.game_channel.createMessageCollector({
							filter,
							time: 60000,
							max: 1,
						});
					collector.on("collect", async (collectedMessage) => {
						// Check the collected message for the specific condition (e.g., contains a certain word)
						const target_player = uno_players.find_player_by_name(
							collectedMessage.content.toLowerCase()
						);
						if (target_player) {
							await target_player.draw(uno_players.drawpile, 3);
							collector.stop();
							resolve(); // Resolve the promise when the condition is met
						}
					});

					collector.on("end", (collected) => {
						if (collected.size === 0) {
							uno_players.game_channel.send("You timed out.");
							collector.stop();
							resolve(); // Resolve the promise when the condition is met
						}
					});
				});
				await red_shell_promise;
				break;
			case `o`:
				await game_channel.send(
					`You got a **fire flower**! Name 4 players to heat them up.`
				);
				const fire_promise = new Promise((resolve) => {
					const filter = (m) =>
						m.author.id === player.user.id &&
						uno_players.find_player_by_name(
							m.content.toLowerCase()
						); // Only collect messages from the author of the command

					const collector =
						uno_players.game_channel.createMessageCollector({
							filter,
							time: 60000,
							max: 4,
						});
					collector.on("collect", async (collectedMessage) => {
						const target_player = uno_players.find_player_by_name(
							collectedMessage.content.toLowerCase()
						);
						if (target_player) {
							uno_players.attack(2, target_player);
						}
					});

					collector.on("end", (collected) => {
						if (collected.size === 0) {
							uno_players.game_channel.send("You timed out.");
							// Resolve the promise when the condition is met
						}
						resolve();
					});
				});
				await fire_promise;
				break;
			case `p`:
				await game_channel.send(
					`You got a **triple red shell**! Name 3 players to make them draw 3 cards.`
				);
				const triple_red_shell_promise = new Promise((resolve) => {
					const filter = (m) =>
						m.author.id === player.user.id &&
						uno_players.find_player_by_name(
							m.content.toLowerCase()
						); // Only collect messages from the author of the command

					const collector =
						uno_players.game_channel.createMessageCollector({
							filter,
							time: 60000,
							max: 3,
						});
					collector.on("collect", async (collectedMessage) => {
						// Check the collected message for the specific condition (e.g., contains a certain word)
						const target_player = uno_players.find_player_by_name(
							collectedMessage.content.toLowerCase()
						);
						if (target_player) {
							await target_player.draw(uno_players.drawpile, 3);
						}
					});

					collector.on("end", (collected) => {
						if (collected.size === 0) {
							uno_players.game_channel.send("You timed out.");
						}
						resolve();
					});
				});
				await triple_red_shell_promise;
				break;
			case `s`:
				await game_channel.send(
					`You got a **lightning bolt**! Everyone else must draw 1 card, and you take another turn.`
				);
				uno_players.forEach(async (p) => {
					if (player.user.id == p.user.id) {
						return;
					}
					await p.draw(uno_players.drawpile, 1);
				});
				uno_players.step(true);
				break;
			case `i`:
				await game_channel.send(
					`You got a **boo**! Steal a card from the next player.`
				);
				const next_player = uno_players.next_player;
				const hand_embed = new EmbedBuilder()
					.setColor(
						next_player.hand.length <= 8
							? 0x00dd00
							: next_player.hand.length <= 16
							? 0xdddd00
							: 0xdd0000
					)
					.setTitle(
						`${
							next_player.user.globalName ??
							next_player.user.username
						}'s hand (${next_player.hand.length}):`
					)
					.setDescription(next_player.hand.text(uno_players));
				await game_channel.send({ embeds: [hand_embed] });
				const boo_promise = new Promise((resolve) => {
					const filter = (m) =>
						m.author.id === player.user.id &&
						next_player.hand.check_for_card(m.content);

					const collector =
						uno_players.game_channel.createMessageCollector({
							filter,
							time: 60000,
							max: 1,
						});
					collector.on("collect", async (m) => {
						// Check the collected message for the specific condition (e.g., contains a certain word)
						const card = next_player.hand.check_for_card(m.content);
						player.hand.push(
							next_player.hand.splice(
								next_player.hand.indexOf(card),
								1
							)
						);
					});

					collector.on("end", (collected) => {
						if (collected.size === 0) {
							uno_players.game_channel.send("You timed out.");
						}
						resolve();
					});
				});
				await boo_promise;
				break;
			case `a`:
				await game_channel.send(
					`You received a **super golden mushroom**! Discard cards until you have 2 cards.`
				);

				const cards_message = await uno_players.game_channel.send({
					components: [cards_row],
					content: `Choose a card to discard (or type \`stop\` to cancel the effect)!`,
				});
				const repeat_discard_promise = new Promise((resolve) => {
					const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command
					const filter2 = (i) => i.user.id == player.user.id;
					const collector =
						uno_players.game_channel.createMessageCollector({
							filter,
							time: 60000,
						});
					const button_collector =
						cards_message.createMessageComponentCollector({
							filter: filter2,
							time: 120000,
						});
					button_collector.on(`collect`, async (i) => {
						await i.reply({
							ephemeral: true,
							content: `${player.hand.default_text}`,
						});
					});
					button_collector.on(`ignore`, async (i) => {
						await i.reply({
							ephemeral: true,
							content: `It's not your turn.`,
						});
						return;
					});
					button_collector.on(`end`, async () => {
						await cards_message.edit({
							components: [],
							content: `Choose a card to discard (or type \`stop\` to cancel the effect)!`,
						});
					});
					collector.on("collect", async (collectedMessage) => {
						if (collectedMessage.content == `stop`) {
							collector.stop();
							button_collector.stop();
							resolve();
							return;
						}
						const args = collectedMessage.content.split(` `);
						// console.log(args);
						const card_chosen = args.reduce((acc, cv) => {
							if (acc) {
								return acc;
							} else {
								return player.hand.check_for_card(cv);
							}
						}, undefined);
						if (!card_chosen || !pile_chosen) {
							return;
						}
						player.play(card_chosen, pile_chosen);
						await uno_players.game_channel.send({
							content: `${player.user.username} placed a **${
								card_chosen.front.text
							}** on dish ${
								uno_players.drawpile.discardpiles.indexOf(
									pile_chosen
								) + 1
							}. (${player.hand.length - 2} left)`,
						});
						if (player.hand.length <= 2) {
							collector.stop();
							resolve();
						}
					});

					collector.on("end", (collected) => {
						if (collected.size === 0) {
							uno_players.game_channel.send("You timed out.");
							collector.stop();
							button_collector.stop();
							resolve();
						}
					});
				});
				await repeat_discard_promise;
				break;
			case `w`:
				await game_channel.send(
					`You received a **bullet bill**! Discard cards until you have the least amount of cards.`
				);
				const cards_message_2 = await uno_players.game_channel.send({
					components: [cards_row],
					content: `Choose a card to discard (or type \`stop\` to cancel the effect)!`,
				});
				const bullet_bill_promise = new Promise((resolve) => {
					const min_hand_count = uno_players
						.map((p) => p.hand.length)
						.toSorted((a, b) => a - b)[0];
					const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command
					const filter2 = (i) => i.user.id == player.user.id;
					const collector =
						uno_players.game_channel.createMessageCollector({
							filter,
							time: 60000,
						});
					const button_collector =
						cards_message_2.createMessageComponentCollector({
							filter: filter2,
							time: 120000,
						});
					button_collector.on(`collect`, async (i) => {
						await i.reply({
							ephemeral: true,
							content: `${player.hand.text}`,
						});
					});
					button_collector.on(`ignore`, async (i) => {
						await i.reply({
							ephemeral: true,
							content: `It's not your turn.`,
						});
						return;
					});
					button_collector.on(`end`, async () => {
						await cards_message_2.edit({
							components: [],
							content: `Choose a card to discard (or type \`stop\` to cancel the effect)!`,
						});
					});
					collector.on("collect", async (collectedMessage) => {
						if (collectedMessage.content == `stop`) {
							collector.stop();
							button_collector.stop();
							resolve();
							return;
						}
						const args = collectedMessage.content.split(` `);
						// console.log(args);
						const card_chosen = args.reduce((acc, cv) => {
							if (acc) {
								return acc;
							} else {
								return player.hand.check_for_card(cv);
							}
						}, undefined);
						if (!card_chosen || !pile_chosen) {
							return;
						}
						player.play(card_chosen, pile_chosen);
						await uno_players.game_channel.send({
							content: `${player.user.username} placed a **${
								card_chosen.front.text
							}** on dish ${
								uno_players.drawpile.discardpiles.indexOf(
									pile_chosen
								) + 1
							}. (${player.hand.length - min_hand_count} left)`,
						});
						if (player.hand.length <= min_hand_count) {
							collector.stop();
							resolve();
						}
					});

					collector.on("end", (collected) => {
						if (collected.size === 0) {
							uno_players.game_channel.send("You timed out.");
							collector.stop();
							button_collector.stop();
							resolve();
						}
					});
				});
				await bullet_bill_promise;
				break;
		}
	},
};
