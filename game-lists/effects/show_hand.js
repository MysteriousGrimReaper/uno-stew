const { EmbedBuilder } = require("discord.js");
module.exports = {
	name: `show`,
	text: `Show Hand`,
	async effect({ uno_players }) {
		const player = uno_players.next_player;
		const hand_embed = new EmbedBuilder()
			.setColor(
				player.hand.length <= 8
					? 0x00dd00
					: player.hand.length <= 16
					? 0xdddd00
					: 0xdd0000
			)
			.setTitle(
				`${player.user.globalName ?? player.user.username}'s hand (${
					player.hand.length
				}):`
			)
			.setDescription(player.hand.text);
		await uno_players.game_channel.send({
			embeds: [hand_embed],
		});
	},
};
