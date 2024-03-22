module.exports = {
	name: `se`,
	text: `Skip Everyone`,
	async effect({ uno_players }) {
		uno_players.step(true);
	},
};
