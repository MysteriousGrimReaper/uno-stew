module.exports = class Choice extends Promise {
    /**
     * 
     * @param uno_players - PlayerManager object representing the game
     * @param input_filter - processes the inputs. should return null or undefined if the message fails
     * @param init_message - initial message explaining the type of choice to make
     * @param repeat_message - any additional messages afterwards
     * @param error_message - what should the bot say if the message does not fit the filter
     * @param max - how many things should it collect?
     * @param timeout - what to do if the user times out
     * @param player - the player making the choice
     * @param {Boolean} unique_choices - whether or not all the choices must be unique 
     */
    constructor({uno_players, input_filter, init_message = `Make a choice!`, repeat_message = init_message, error_message = `Invalid option. Make another choice.`, max, timeout, player, unique_choices = true}) {
        const choice_promise = (resolve) => {
            uno_players.game_channel.send(init_message)
			const filter = (m) => m.author.id === player.user.id; // Only collect messages from the author of the command

			const collector = uno_players.game_channel.createMessageCollector({
				filter,
				time: 1000 * 60 * 2,
			});
            const collected = []
			collector.on("collect", async (collectedMessage) => {
                const collected_input = input_filter(collectedMessage)
                if ((collected_input ?? null) != null) {
                    if (unique_choices && collected.includes(collected_input)) {
                        return
                    }
                    collected.push(collected_input)
                    if (collected.length >= max) {
                        collector.stop()
                    }
                    else {
                        uno_players.game_channel.send(repeat_message)
                    }
                }
                else {
                    uno_players.game_channel.send(error_message)
                }
				// Check the collected message for the specific condition (e.g., contains a certain word)
				if (heads) {
					tails = uno_players.find_player_by_name(
						collectedMessage.content.toLowerCase()
					);
					if (!tails) {
						return;
					}
				} else {
					heads = uno_players.find_player_by_name(
						collectedMessage.content.toLowerCase()
					);
					if (heads) {
						await uno_players.game_channel.send(
							`Choose a player to be **tails**.`
						);
					}
					return;
				}
				if (!(heads && tails)) {
					return;
				}
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
				resolve();
			});

			collector.on("end", () => {
                if (collected.length == 0) {
                    timeout()
                }
                resolve(collected.length > 0 ? collected : null)
			});
		}
        super(choice_promise)
    }
}