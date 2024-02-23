const { Events, Collection } = require("discord.js");
const { getCollector } = require("../commands/study/study.js");
const { get_hand_collect_reply_fn } = require("../commands/games/unoflip.js");
const {
	get_hand_collect_reply_fn_stew,
} = require("../commands/games/unostew.js");
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const client = interaction.client;
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			const { cooldowns } = client;

			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const defaultCooldownDuration = 3;
			const cooldownAmount =
				(command.cooldown ?? defaultCooldownDuration) * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime =
					timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1000);
					return interaction.reply({
						content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
						ephemeral: true,
					});
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(
				() => timestamps.delete(interaction.user.id),
				cooldownAmount
			);

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		} else if (interaction.isButton()) {
			const collector = getCollector();
			if (collector && interaction.customId == `study_quit`) {
				if (collector.userId != interaction.user.id) {
					interaction.reply({
						ephemeral: true,
						content: `You can't close this study session, you're not the one studying!`,
					});
					return;
				}
				collector.on(`end`, (collected) => {
					interaction.reply(
						`Study finished! You answered ${collected.size} questions.`
					);
					collector.userId = false;
				});
				collector.stop();
			}
			const hand_collect_reply_fn = get_hand_collect_reply_fn();
			if (hand_collect_reply_fn) {
				await hand_collect_reply_fn(interaction);
			}
			const hand_collect_reply_fn_stew = get_hand_collect_reply_fn_stew();
			if (hand_collect_reply_fn_stew) {
				await hand_collect_reply_fn_stew(interaction);
			}
		}
	},
};
