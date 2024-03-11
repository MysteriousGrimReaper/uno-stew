const fs = require("fs");
const path = require("path");
const dir = `C:/Users/A/Documents/GitHub/uno-stew/uno-stew`;
const effects_path = path.join(dir, `game-lists/stew/effects`);
const icon_map = new Map();

const effect_folder = fs.readdirSync(effects_path);
const effect_list = [];
const effect_names = [];
for (const effect_file of effect_folder) {
	const filePath = path.join(effects_path, effect_file);
	const effect = require(filePath);
	effect_list.push(effect);
	if (!effect.name) {
		throw new Error(`Effect at ${filePath} is missing a name.`);
	}
	if (!effect.text) {
		throw new Error(`Effect at ${filePath} is missing a display text.`);
	}
	effect_names.push(effect.name);
	if (icon_map.has(effect.name)) {
		throw new Error(
			`Effect name ${effect.name} is used multiple times (${filePath}).`
		);
	}
	icon_map.set(effect.name, effect.text);
}

console.log(icon_map);
const color_map = new Map();
color_map.set("r", "Red");
color_map.set("b", "Blue");
color_map.set("g", "Green");
color_map.set("y", "Yellow");
color_map.set("m", "Magenta");
color_map.set("p", "Pink");
color_map.set("o", "Orange");
color_map.set("s", "Silver");
color_map.set("a", "Amber");
color_map.set("i", "Ivory");
color_map.set("w", "Wild");
exports.color_map = color_map;
const color_keys = [];
const color_values = [];
for (const value of color_map.keys()) {
	color_keys.push(value);
}
for (const value of color_map.values()) {
	color_values.push(value);
}
exports.color_keys = color_keys;
exports.color_values = color_values;

const emoji_map = new Map();
emoji_map.set("r", "🍎");
emoji_map.set("b", "🫐");
emoji_map.set("g", "🥑");
emoji_map.set("y", "🍋");
emoji_map.set("m", "🍇");
emoji_map.set("p", "🍑");
emoji_map.set("o", "🍊");
emoji_map.set("s", "🧄");
emoji_map.set("a", "🥐");
emoji_map.set("i", "🥚");
emoji_map.set("w", "🍨");
const special_emoji_map = new Map();
special_emoji_map.set("r", "🍓");
special_emoji_map.set("b", "🐟");
special_emoji_map.set("g", "🥦");
special_emoji_map.set("y", "🍍");
special_emoji_map.set("m", "🍆");
special_emoji_map.set("p", "🎂");
special_emoji_map.set("o", "🥕");
special_emoji_map.set("s", "🥛");
special_emoji_map.set("a", "🥨");
special_emoji_map.set("i", "🍥");
special_emoji_map.set("w", "🍔");
exports.special_emoji_map = special_emoji_map;
exports.emoji_map = emoji_map;

exports.icon_map = icon_map;

const icon_keys = [];
const icon_values = [];
for (const value of icon_map.keys()) {
	icon_keys.push(value);
}
for (const value of icon_map.values()) {
	icon_values.push(value);
}
for (let value = 0; value <= 23; value++) {
	icon_keys.push(value.toString());
}
icon_keys.push("-10");
exports.icon_keys = icon_keys;
exports.icon_values = icon_values;
