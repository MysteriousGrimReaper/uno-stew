module.exports = {
	name: `h10`,
	text: `Heat 10`,
	level: 2,
	wild: true,
	async effect({ uno_players }) {
		await uno_players.attack(10, uno_players.next_player);
	},
};
