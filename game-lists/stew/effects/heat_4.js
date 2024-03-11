module.exports = {
	name: `h4`,
	text: `Heat 4`,
	async effect({ uno_players }) {
		await uno_players.attack(4, uno_players.next_player);
	},
};
