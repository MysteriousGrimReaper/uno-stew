module.exports = {
	name: `h2`,
	text: `Heat 2`,
	async effect({ uno_players }) {
		await uno_players.attack(2, uno_players.next_player);
	},
};
