/* eslint-disable no-mixed-spaces-and-tabs */
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
module.exports = {
	name: `-x2`,
	text: `Discard All Except 2`,
	async effect({ uno_players, player }) {
		const cards_button = new ButtonBuilder()
			.setCustomId(`view-cards`)
			.setLabel("Playable Cards")
			.setStyle(ButtonStyle.Primary);
		const cards_row = new ActionRowBuilder().addComponents(cards_button);
		const cards_message = await uno_players.game_channel.send({
			components: [cards_row],
			content: `Choose a card and a pile to discard to (or type \`stop\` to cancel the effect)!`,
		});
		const repeat_discard_promise = new Promise((resolve) => {
			const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command
			const filter2 = (i) => i.user.id == player.user.id;
			const collector = uno_players.game_channel.createMessageCollector({
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
				await cards_message.edit({
					components: [],
					content: `Choose a card and a pile to discard to (or type \`stop\` to cancel the effect)!`,
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
											d.color == card_chosen.color ||
											d.icon == card_chosen.icon
									)
						  ] ?? uno_players.drawpile.discardpiles[0];
				if (!card_chosen || !pile_chosen) {
					return;
				}
				player.play(card_chosen, pile_chosen);
				await uno_players.game_channel.send({
					content: `${player.user.username} placed a **${
						card_chosen.front.text
					}** on dish ${
						uno_players.drawpile.discardpiles.indexOf(pile_chosen) +
						1
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
	},
};
