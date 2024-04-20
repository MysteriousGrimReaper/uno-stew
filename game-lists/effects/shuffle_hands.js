function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}
module.exports = {
	name: `shuf`,
	text: `Shuffle Hands`,
	wild: true,
	async effect({ uno_players }) {
		const card_distributor = [];
		const hand_lengths = uno_players.map((p) => p.hand.length);
		uno_players.forEach((p) => {
			while (p.hand.length > 0) {
				card_distributor.push(p.hand.pop());
			}
		});
		shuffle(card_distributor);
		for (let i = 0; i < hand_lengths.length; i++) {
			while (uno_players[i].hand.length < hand_lengths[i]) {
				uno_players[i].hand.push(card_distributor.pop());
			}
		}
		await uno_players.game_channel.send(`Check out your new hands.`);
	},
};
