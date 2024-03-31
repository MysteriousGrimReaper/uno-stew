module.exports = {
	name: `-2`,
	text: `Negative 2`,
	async effect({ uno_players, pile_chosen }) {
		const discarder = uno_players.next_player;
		pile_chosen.push(
			discarder.hand.splice(
				Math.floor(discarder.hand.length * Math.random()),
				1
			)
		);
		if (discarder.hand.length > 0) {
			pile_chosen.push(
				discarder.hand.splice(
					Math.floor(discarder.hand.length * Math.random()),
					1
				)
			);
		}
		await discarder.draw(uno_players.drawpile, 2);
		await uno_players.game_channel.send(
			`${discarder.user} replaced two random cards!`
		);
	},
};
