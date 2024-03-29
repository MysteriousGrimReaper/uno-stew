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
	name: `cl`,
	text: `Clear`,
	async effect({ uno_players, pile_chosen }) {
		while (pile_chosen.length > 1) {
			uno_players.drawpile.push(pile_chosen.shift());
		}
		shuffle(uno_players.drawpile);
		await uno_players.game_channel.send(
			`Dish ${
				uno_players.drawpile.discardpiles.indexOf(pile_chosen) + 1
			} has been cleared!`
		);
	},
};
