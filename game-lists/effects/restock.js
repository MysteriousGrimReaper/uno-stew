/* eslint-disable no-mixed-spaces-and-tabs */
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
module.exports = {
	name: `-+`,
	text: `Restock`,
	wild: true,
	// level: 2,
	async effect({ uno_players, player }) {
		const cards_to_draw = player.hand.length - 3;
		const cards_button = new ButtonBuilder()
			.setCustomId(`view-cards`)
			.setLabel("Playable Cards")
			.setStyle(ButtonStyle.Primary);
		const cards_row = new ActionRowBuilder().addComponents(cards_button);
		const cards_message = await uno_players.game_channel.send({
			components: [cards_row],
			content: `Choose a card to keep (or type \`stop\` to cancel the effect)!`,
		});
		const repeat_discard_promise = new Promise((resolve) => {
			const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command
			const filter2 = (i) => i.user.id == player.user.id;
			const collector = uno_players.game_channel.createMessageCollector({
				filter,
			});
			const button_collector =
				cards_message.createMessageComponentCollector({
					filter: filter2,
				});
			button_collector.on(`collect`, async (i) => {
				await i.deferReply({ ephemeral: true });
				await i.editReply({
					ephemeral: true,
					content: `${player.hand_embed(uno_players)}`,
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
					content: `Choose a card to keep and a pile to discard to (or type \`stop\` to cancel the effect)!`,
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

				// console.log(player.hand);
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
				const pile_chosen =
					pile_indicator != undefined
						? uno_players.drawpile.discardpiles[
								parseInt(pile_indicator[1]) - 1
						  ]
						: uno_players.drawpile.discardpiles[
								uno_players.drawpile.discardpiles
									.map((p) => p.top_card)
									.findIndex(
										(d) =>
											d.wild ||
											d.color == card_chosen?.color ||
											d.icon == card_chosen?.icon
									)
						  ] ?? uno_players.drawpile.discardpiles[0];
				if (!card_chosen || !pile_chosen) {
					return;
				}
				player.hand.forEach((card) => {
					if (card != card_chosen) {
						player.play(card, pile_chosen);
					}
				});
				collector.stop();
			});

			collector.on("end", async (collected) => {
				if (collected.size === 0) {
					uno_players.game_channel.send("You timed out.");
				}
				button_collector.stop();
				await uno_players.game_channel.send(
					`You discarded the rest of your hand onto the pile.`
				);
				player.draw(uno_players.drawpile, cards_to_draw);

				resolve();
			});
		});
		await repeat_discard_promise;
	},
};
