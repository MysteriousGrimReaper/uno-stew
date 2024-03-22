module.exports = {
	name: `+o1-6`,
	text: `Others Draw 1-6`,
	async effect({ uno_players, player }) {
		uno_players.forEach(async p => {
            if (player.user.id == p.user.id) {return}
            await p.draw(uno_players.drawpile, Math.ceil(Math.random() * 6))
        });
	},
};
