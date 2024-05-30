const wait = require("node:timers/promises").setTimeout;
const PlayerChoice = require("./structures/player_choice.js")
module.exports = {
	name: `50`,
	text: `50/50`,
	level: 3,
	wild: true,
	async effect({ uno_players, player }) {
		const init_message = `${player.user.globalName}, choose a player to be **heads**.`
		const repeat_message = `Choose a player to be **tails**.`
		const error_message = `Choose a player by typing their name or pinging them.`
		const max = 2
		const timeout = () => uno_players.game_channel.send(`You timed out.`)
		const coin_choice = new PlayerChoice({
			uno_players,
			init_message,
			repeat_message,
			error_message,
			timeout,
			player,
			unique_choices: true
		})
		const coin_players = await coin_choice
		if (coin_choice) {
			const heads = coin_players[0]
			const tails = coin_players[1]
			const coin_flip_message = await uno_players.game_channel.send(
				`Flipping coin...\n🪙${heads.name}\n▪️${tails.name}`
			);
			let flips = 2 + Math.ceil(Math.random() * 10);
			let side_index = 0;
			while (flips > 0) {
				flips--;
				await wait(Math.random() * 500 + 500);
				side_index++;
				side_index %= 2;
				coin_flip_message.edit(
					`Flipping coin...${
						side_index == 1
							? `\n🪙 ${heads.name}\n▪️ ${tails.name}`
							: `\n▪️ ${heads.name}\n🪙 ${tails.name}`
					}`
				);
			}
			await wait(Math.random() * 500 + 500);
			const side = side_index == 1 ? `heads` : `tails`;
			const player_who_draws = side == `heads` ? tails : heads;
			await wait(500);
			await uno_players.game_channel.send(
				`The coin lands **${side}**! ${player_who_draws.name}, draw 4 cards.`
			);
			await player_who_draws.draw(uno_players.drawpile, 4);
		}
		await wait(500);
	},
};
