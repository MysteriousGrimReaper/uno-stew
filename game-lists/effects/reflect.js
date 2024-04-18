module.exports = {
	name: `rf`,
	text: `Reflect`,
	draw_stackable: true,
	async effect({ uno_players }) {
		uno_players.draw_stack *= 2;
		uno_players.play_direction *= -1;
		await uno_players.game_channel.send(
			`You reflected and doubled the stack!`
		);
	},
};
