const Choice = require("./choice.js")
module.exports = class PlayerChoice extends Choice {
    constructor({uno_players, init_message = `Choose a number!`, repeat_message = init_message, error_message = `Invalid option. Choose another number.`, max, timeout, player, unique_choices = true, only_include_uno_numbers = true, integer = true}) {
        const input_filter = m => {
			return uno_players.parse_user(m)
		}
        super({
            uno_players,
            input_filter,
            init_message,
            repeat_message,
            error_message,
            max,
            timeout,
            player,
            unique_choices
        })
    }
}