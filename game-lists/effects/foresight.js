const { EmbedBuilder } = require("discord.js");
module.exports = {
	name: `fs`,
	text: `Foresight`,
	level: 1,
	async effect({ uno_players, player }) {
		await uno_players.game_channel.send(
			`${
				player.user.globalName ?? player.user.username
			}, check your direct messages.`
		);
		const foresight_embed = new EmbedBuilder()
			.setTitle(`The top 5 cards of the deck are:`)
			.setDescription(
				`- ${uno_players.drawpile
					.slice(uno_players.drawpile.length - 5)
					.map((card) => card.text)
					.reverse()
					.join(`\n- `)}`
			);
		await player.user.send({ embeds: [foresight_embed] });
	},
};
