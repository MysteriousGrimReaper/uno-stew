module.exports = {
	name: `ha`,
	text: `Heat All`,
	wild: true,
	async effect({ uno_players }) {
		for (let i = 0; i < uno_players.length; i++) {
			if (
				await uno_players.attack(
					1,
					uno_players[
						(i + uno_players.current_turn_index) %
							uno_players.length
					]
				)
			) {
				break;
			}
		}
	},
};
