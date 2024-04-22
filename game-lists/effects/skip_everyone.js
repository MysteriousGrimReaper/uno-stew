module.exports = {
	name: `se`,
	text: `Skip Everyone`,
	level: 1,
	async effect({ uno_players }) {
		uno_players.step(true);
	},
};
