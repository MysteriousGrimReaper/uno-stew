const Choice = require("./choice.js")
const {color_keys, color_values} = require("../../maps.js")
module.exports = class ColorChoice extends Choice {
    constructor({uno_players, init_message = `Choose a color!`, repeat_message = init_message, error_message = `Invalid option. Choose another color.`, max, timeout, player, unique_choices = true, allow_wild = true}) {
        const input_filter = m => {
            let {content} = m
            content = content.toLowerCase()
            let _color
            const lower_color_values = color_values.map(v => v.toLowerCase()).findIndex(c => c == content)
            if (color_keys.includes(content)) {
                _color = content
            }
            else if (lower_color_values > -1) {
                _color = color_keys[lower_color_values]
            }
            if (_color == `w` && !allow_wild) {
                _color = undefined
            }
			return _color
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