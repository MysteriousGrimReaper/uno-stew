module.exports = {
	name: `re`,
	text: `Reverse`,
	level: 0,
	async effect({ uno_players }) {
		uno_players.reverse();
	},
};
