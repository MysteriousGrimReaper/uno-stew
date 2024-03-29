const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
module.exports = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Shows how many wins each player has."),
	async execute(interaction) {
		const ldb = await db.all();
		console.log(await db.all());
		ldb.sort((a, b) => a.value.wins - b.value.wins);
		const ldb_embed = new EmbedBuilder()
			.setTitle(`Chocolate Leaderboard`)
			.setDescription(
				`${ldb.map((x) => `<@${x.id}>: ${x.value.wins} 🍫`).join(`\n`)}`
			)
			.setColor(0xaa521c);
		return await interaction.reply({ embeds: [ldb_embed] });
	},
};
