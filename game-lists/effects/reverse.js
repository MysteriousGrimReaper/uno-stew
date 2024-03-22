module.exports = {
	name: `re`,
	text: `Reverse`,
	async effect({ uno_players }) {
		uno_players.reverse();
	},
};
