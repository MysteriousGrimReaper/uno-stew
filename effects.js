const fs = require("fs");
const path = require("path");
const uno_stew_path = `../uno-stew/game-lists`;
const effects_path = path.join(uno_stew_path, `/effects`);

const effect_folder = fs.readdirSync(effects_path);
const effect_list = [];
for (const effect_file of effect_folder) {
	const filePath = path.join(effects_path, effect_file);
	const effect = require(filePath);
	effect_list.push(effect);
}
const extra_card_list = [
	`{"color": "r", "icon": "11" }`,
	`{"color": "r", "icon": "12" }`,
	`{"color": "r", "icon": "13" }`,
	`{"color": "r", "icon": "14" }`,
	`{"color": "r", "icon": "15" }`,
	`{"color": "r", "icon": "16" }`,
	`{"color": "r", "icon": "17" }`,
	`{"color": "r", "icon": "18" }`,
	`{"color": "r", "icon": "19" }`,
	`{"color": "r", "icon": "20" }`,
	`{"color": "r", "icon": "21" }`,
	`{"color": "r", "icon": "22" }`,
	`{"color": "r", "icon": "23" }`,
	`{"color": "g", "icon": "11" }`,
	`{"color": "g", "icon": "12" }`,
	`{"color": "g", "icon": "13" }`,
	`{"color": "g", "icon": "14" }`,
	`{"color": "g", "icon": "15" }`,
	`{"color": "g", "icon": "16" }`,
	`{"color": "g", "icon": "17" }`,
	`{"color": "g", "icon": "18" }`,
	`{"color": "g", "icon": "19" }`,
	`{"color": "g", "icon": "20" }`,
	`{"color": "g", "icon": "21" }`,
	`{"color": "g", "icon": "22" }`,
	`{"color": "g", "icon": "23" }`,
	`{"color": "y", "icon": "11" }`,
	`{"color": "y", "icon": "12" }`,
	`{"color": "y", "icon": "13" }`,
	`{"color": "y", "icon": "14" }`,
	`{"color": "y", "icon": "15" }`,
	`{"color": "y", "icon": "16" }`,
	`{"color": "y", "icon": "17" }`,
	`{"color": "y", "icon": "18" }`,
	`{"color": "y", "icon": "19" }`,
	`{"color": "y", "icon": "20" }`,
	`{"color": "y", "icon": "21" }`,
	`{"color": "y", "icon": "22" }`,
	`{"color": "y", "icon": "23" }`,
	`{"color": "b", "icon": "11" }`,
	`{"color": "b", "icon": "12" }`,
	`{"color": "b", "icon": "13" }`,
	`{"color": "b", "icon": "14" }`,
	`{"color": "b", "icon": "15" }`,
	`{"color": "b", "icon": "16" }`,
	`{"color": "b", "icon": "17" }`,
	`{"color": "b", "icon": "18" }`,
	`{"color": "b", "icon": "19" }`,
	`{"color": "b", "icon": "20" }`,
	`{"color": "b", "icon": "21" }`,
	`{"color": "b", "icon": "22" }`,
	`{"color": "b", "icon": "23" }`,
	`{"color": "m", "icon": "11" }`,
	`{"color": "m", "icon": "12" }`,
	`{"color": "m", "icon": "13" }`,
	`{"color": "m", "icon": "14" }`,
	`{"color": "m", "icon": "15" }`,
	`{"color": "m", "icon": "16" }`,
	`{"color": "m", "icon": "17" }`,
	`{"color": "m", "icon": "18" }`,
	`{"color": "m", "icon": "19" }`,
	`{"color": "m", "icon": "20" }`,
	`{"color": "m", "icon": "21" }`,
	`{"color": "m", "icon": "22" }`,
	`{"color": "m", "icon": "23" }`,
	`{"color": "o", "icon": "11" }`,
	`{"color": "o", "icon": "12" }`,
	`{"color": "o", "icon": "13" }`,
	`{"color": "o", "icon": "14" }`,
	`{"color": "o", "icon": "15" }`,
	`{"color": "o", "icon": "16" }`,
	`{"color": "o", "icon": "17" }`,
	`{"color": "o", "icon": "18" }`,
	`{"color": "o", "icon": "19" }`,
	`{"color": "o", "icon": "20" }`,
	`{"color": "o", "icon": "21" }`,
	`{"color": "o", "icon": "22" }`,
	`{"color": "o", "icon": "23" }`,
	`{"color": "p", "icon": "11" }`,
	`{"color": "p", "icon": "12" }`,
	`{"color": "p", "icon": "13" }`,
	`{"color": "p", "icon": "14" }`,
	`{"color": "p", "icon": "15" }`,
	`{"color": "p", "icon": "16" }`,
	`{"color": "p", "icon": "17" }`,
	`{"color": "p", "icon": "18" }`,
	`{"color": "p", "icon": "19" }`,
	`{"color": "p", "icon": "20" }`,
	`{"color": "p", "icon": "21" }`,
	`{"color": "p", "icon": "22" }`,
	`{"color": "p", "icon": "23" }`,
	`{"color": "s", "icon": "11" }`,
	`{"color": "s", "icon": "12" }`,
	`{"color": "s", "icon": "13" }`,
	`{"color": "s", "icon": "14" }`,
	`{"color": "s", "icon": "15" }`,
	`{"color": "s", "icon": "16" }`,
	`{"color": "s", "icon": "17" }`,
	`{"color": "s", "icon": "18" }`,
	`{"color": "s", "icon": "19" }`,
	`{"color": "s", "icon": "20" }`,
	`{"color": "s", "icon": "21" }`,
	`{"color": "s", "icon": "22" }`,
	`{"color": "s", "icon": "23" }`,
	`{"color": "a", "icon": "11" }`,
	`{"color": "a", "icon": "12" }`,
	`{"color": "a", "icon": "13" }`,
	`{"color": "a", "icon": "14" }`,
	`{"color": "a", "icon": "15" }`,
	`{"color": "a", "icon": "16" }`,
	`{"color": "a", "icon": "17" }`,
	`{"color": "a", "icon": "18" }`,
	`{"color": "a", "icon": "19" }`,
	`{"color": "a", "icon": "20" }`,
	`{"color": "a", "icon": "21" }`,
	`{"color": "a", "icon": "22" }`,
	`{"color": "a", "icon": "23" }`,
	`{"color": "i", "icon": "11" }`,
	`{"color": "i", "icon": "12" }`,
	`{"color": "i", "icon": "13" }`,
	`{"color": "i", "icon": "14" }`,
	`{"color": "i", "icon": "15" }`,
	`{"color": "i", "icon": "16" }`,
	`{"color": "i", "icon": "17" }`,
	`{"color": "i", "icon": "18" }`,
	`{"color": "i", "icon": "19" }`,
	`{"color": "i", "icon": "20" }`,
	`{"color": "i", "icon": "21" }`,
	`{"color": "i", "icon": "22" }`,
	`{"color": "i", "icon": "23" }`,
];
let card_list = [
	`{"color": "r", "icon": "1" }`,
	`{"color": "r", "icon": "2" }`,
	`{"color": "r", "icon": "3" }`,
	`{"color": "r", "icon": "4" }`,
	`{"color": "r", "icon": "5" }`,
	`{"color": "r", "icon": "6" }`,
	`{"color": "r", "icon": "7" }`,
	`{"color": "r", "icon": "8" }`,
	`{"color": "r", "icon": "9" }`,
	`{"color": "r", "icon": "0" }`,
	`{"color": "r", "icon": "1" }`,
	`{"color": "r", "icon": "2" }`,
	`{"color": "r", "icon": "3" }`,
	`{"color": "r", "icon": "4" }`,
	`{"color": "r", "icon": "5" }`,
	`{"color": "r", "icon": "6" }`,
	`{"color": "r", "icon": "7" }`,
	`{"color": "r", "icon": "8" }`,
	`{"color": "r", "icon": "9" }`,
	`{"color": "r", "icon": "0" }`,
	`{"color": "g", "icon": "1" }`,
	`{"color": "g", "icon": "2" }`,
	`{"color": "g", "icon": "3" }`,
	`{"color": "g", "icon": "4" }`,
	`{"color": "g", "icon": "5" }`,
	`{"color": "g", "icon": "6" }`,
	`{"color": "g", "icon": "7" }`,
	`{"color": "g", "icon": "8" }`,
	`{"color": "g", "icon": "9" }`,
	`{"color": "g", "icon": "0" }`,
	`{"color": "g", "icon": "1" }`,
	`{"color": "g", "icon": "2" }`,
	`{"color": "g", "icon": "3" }`,
	`{"color": "g", "icon": "4" }`,
	`{"color": "g", "icon": "5" }`,
	`{"color": "g", "icon": "6" }`,
	`{"color": "g", "icon": "7" }`,
	`{"color": "g", "icon": "8" }`,
	`{"color": "g", "icon": "9" }`,
	`{"color": "g", "icon": "0" }`,
	`{"color": "y", "icon": "1" }`,
	`{"color": "y", "icon": "2" }`,
	`{"color": "y", "icon": "3" }`,
	`{"color": "y", "icon": "4" }`,
	`{"color": "y", "icon": "5" }`,
	`{"color": "y", "icon": "6" }`,
	`{"color": "y", "icon": "7" }`,
	`{"color": "y", "icon": "8" }`,
	`{"color": "y", "icon": "9" }`,
	`{"color": "y", "icon": "0" }`,
	`{"color": "y", "icon": "1" }`,
	`{"color": "y", "icon": "2" }`,
	`{"color": "y", "icon": "3" }`,
	`{"color": "y", "icon": "4" }`,
	`{"color": "y", "icon": "5" }`,
	`{"color": "y", "icon": "6" }`,
	`{"color": "y", "icon": "7" }`,
	`{"color": "y", "icon": "8" }`,
	`{"color": "y", "icon": "9" }`,
	`{"color": "y", "icon": "0" }`,
	`{"color": "b", "icon": "1" }`,
	`{"color": "b", "icon": "2" }`,
	`{"color": "b", "icon": "3" }`,
	`{"color": "b", "icon": "4" }`,
	`{"color": "b", "icon": "5" }`,
	`{"color": "b", "icon": "6" }`,
	`{"color": "b", "icon": "7" }`,
	`{"color": "b", "icon": "8" }`,
	`{"color": "b", "icon": "9" }`,
	`{"color": "b", "icon": "0" }`,
	`{"color": "b", "icon": "1" }`,
	`{"color": "b", "icon": "2" }`,
	`{"color": "b", "icon": "3" }`,
	`{"color": "b", "icon": "4" }`,
	`{"color": "b", "icon": "5" }`,
	`{"color": "b", "icon": "6" }`,
	`{"color": "b", "icon": "7" }`,
	`{"color": "b", "icon": "8" }`,
	`{"color": "b", "icon": "9" }`,
	`{"color": "b", "icon": "0" }`,
	`{"color": "m", "icon": "1" }`,
	`{"color": "m", "icon": "2" }`,
	`{"color": "m", "icon": "3" }`,
	`{"color": "m", "icon": "4" }`,
	`{"color": "m", "icon": "5" }`,
	`{"color": "m", "icon": "6" }`,
	`{"color": "m", "icon": "7" }`,
	`{"color": "m", "icon": "8" }`,
	`{"color": "m", "icon": "9" }`,
	`{"color": "m", "icon": "0" }`,
	`{"color": "m", "icon": "1" }`,
	`{"color": "m", "icon": "2" }`,
	`{"color": "m", "icon": "3" }`,
	`{"color": "m", "icon": "4" }`,
	`{"color": "m", "icon": "5" }`,
	`{"color": "m", "icon": "6" }`,
	`{"color": "m", "icon": "7" }`,
	`{"color": "m", "icon": "8" }`,
	`{"color": "m", "icon": "9" }`,
	`{"color": "m", "icon": "0" }`,
	`{"color": "o", "icon": "1" }`,
	`{"color": "o", "icon": "2" }`,
	`{"color": "o", "icon": "3" }`,
	`{"color": "o", "icon": "4" }`,
	`{"color": "o", "icon": "5" }`,
	`{"color": "o", "icon": "6" }`,
	`{"color": "o", "icon": "7" }`,
	`{"color": "o", "icon": "8" }`,
	`{"color": "o", "icon": "9" }`,
	`{"color": "o", "icon": "0" }`,
	`{"color": "o", "icon": "1" }`,
	`{"color": "o", "icon": "2" }`,
	`{"color": "o", "icon": "3" }`,
	`{"color": "o", "icon": "4" }`,
	`{"color": "o", "icon": "5" }`,
	`{"color": "o", "icon": "6" }`,
	`{"color": "o", "icon": "7" }`,
	`{"color": "o", "icon": "8" }`,
	`{"color": "o", "icon": "9" }`,
	`{"color": "o", "icon": "0" }`,
	`{"color": "p", "icon": "1" }`,
	`{"color": "p", "icon": "2" }`,
	`{"color": "p", "icon": "3" }`,
	`{"color": "p", "icon": "4" }`,
	`{"color": "p", "icon": "5" }`,
	`{"color": "p", "icon": "6" }`,
	`{"color": "p", "icon": "7" }`,
	`{"color": "p", "icon": "8" }`,
	`{"color": "p", "icon": "9" }`,
	`{"color": "p", "icon": "0" }`,
	`{"color": "p", "icon": "1" }`,
	`{"color": "p", "icon": "2" }`,
	`{"color": "p", "icon": "3" }`,
	`{"color": "p", "icon": "4" }`,
	`{"color": "p", "icon": "5" }`,
	`{"color": "p", "icon": "6" }`,
	`{"color": "p", "icon": "7" }`,
	`{"color": "p", "icon": "8" }`,
	`{"color": "p", "icon": "9" }`,
	`{"color": "p", "icon": "0" }`,
	`{"color": "s", "icon": "1" }`,
	`{"color": "s", "icon": "2" }`,
	`{"color": "s", "icon": "3" }`,
	`{"color": "s", "icon": "4" }`,
	`{"color": "s", "icon": "5" }`,
	`{"color": "s", "icon": "6" }`,
	`{"color": "s", "icon": "7" }`,
	`{"color": "s", "icon": "8" }`,
	`{"color": "s", "icon": "9" }`,
	`{"color": "s", "icon": "0" }`,
	`{"color": "s", "icon": "1" }`,
	`{"color": "s", "icon": "2" }`,
	`{"color": "s", "icon": "3" }`,
	`{"color": "s", "icon": "4" }`,
	`{"color": "s", "icon": "5" }`,
	`{"color": "s", "icon": "6" }`,
	`{"color": "s", "icon": "7" }`,
	`{"color": "s", "icon": "8" }`,
	`{"color": "s", "icon": "9" }`,
	`{"color": "s", "icon": "0" }`,

	`{"color": "a", "icon": "1" }`,
	`{"color": "a", "icon": "2" }`,
	`{"color": "a", "icon": "3" }`,
	`{"color": "a", "icon": "4" }`,
	`{"color": "a", "icon": "5" }`,
	`{"color": "a", "icon": "6" }`,
	`{"color": "a", "icon": "7" }`,
	`{"color": "a", "icon": "8" }`,
	`{"color": "a", "icon": "9" }`,
	`{"color": "a", "icon": "0" }`,
	`{"color": "a", "icon": "1" }`,
	`{"color": "a", "icon": "2" }`,
	`{"color": "a", "icon": "3" }`,
	`{"color": "a", "icon": "4" }`,
	`{"color": "a", "icon": "5" }`,
	`{"color": "a", "icon": "6" }`,
	`{"color": "a", "icon": "7" }`,
	`{"color": "a", "icon": "8" }`,
	`{"color": "a", "icon": "9" }`,
	`{"color": "a", "icon": "0" }`,

	`{"color": "i", "icon": "1" }`,
	`{"color": "i", "icon": "2" }`,
	`{"color": "i", "icon": "3" }`,
	`{"color": "i", "icon": "4" }`,
	`{"color": "i", "icon": "5" }`,
	`{"color": "i", "icon": "6" }`,
	`{"color": "i", "icon": "7" }`,
	`{"color": "i", "icon": "8" }`,
	`{"color": "i", "icon": "9" }`,
	`{"color": "i", "icon": "0" }`,
	`{"color": "i", "icon": "1" }`,
	`{"color": "i", "icon": "2" }`,
	`{"color": "i", "icon": "3" }`,
	`{"color": "i", "icon": "4" }`,
	`{"color": "i", "icon": "5" }`,
	`{"color": "i", "icon": "6" }`,
	`{"color": "i", "icon": "7" }`,
	`{"color": "i", "icon": "8" }`,
	`{"color": "i", "icon": "9" }`,
	`{"color": "i", "icon": "0" }`,
];
/**
 * Levels:
 * 0 - base UNO (skip, reverse, +2, +4)
 * 1 - more draws, simple hand cards and effects (+1, +3, +5, +6, +7, +8, +9, +10, show hand, skip 2, skip everyone, reverse skip, foresight)
 * 2 - oven cards and all draw (heat 2, 4, 10, all, +o1, +o1-6, +1-6, +a2, +o2)
 * 3 - targeted cards (exheat, trade hands, trade places, swap hands, +@2, +@4, steal a slice, 50/50)
 * 4 - draw interactive (draw color, -2, color roulette, microwave, reflect, overload, clear, shuffle hands, shield)
 * 5 - popcorn/flex and discards, cards up to 23 (all popcorn, popcorn, flip, discard color, discard number, repeat color discard, wild number, discard until 2)
 * 6 - cruelty (hurry up, item box, dance, 99)
 */
const max_level = 6;
if (max_level > 7) {
	card_list = [...card_list, ...extra_card_list];
}
for (const effect of effect_list) {
	if (effect.level > max_level || effect.level == undefined) {
		continue;
	}
	switch (effect.wild) {
		case true:
			card_list.push(`{"color":"w","icon":"${effect.name}"}`);
			break;
		case false:
			card_list.push(`{"color":"r","icon":"${effect.name}"}`);
			card_list.push(`{"color":"g","icon":"${effect.name}"}`);
			card_list.push(`{"color":"y","icon":"${effect.name}"}`);
			card_list.push(`{"color":"b","icon":"${effect.name}"}`);
			card_list.push(`{"color":"m","icon":"${effect.name}"}`);
			card_list.push(`{"color":"o","icon":"${effect.name}"}`);
			card_list.push(`{"color":"p","icon":"${effect.name}"}`);
			card_list.push(`{"color":"s","icon":"${effect.name}"}`);
			card_list.push(`{"color":"a","icon":"${effect.name}"}`);
			card_list.push(`{"color":"i","icon":"${effect.name}"}`);
			break;
		case undefined:
			card_list.push(`{"color":"w","icon":"${effect.name}"}`);
			card_list.push(`{"color":"r","icon":"${effect.name}"}`);
			card_list.push(`{"color":"g","icon":"${effect.name}"}`);
			card_list.push(`{"color":"y","icon":"${effect.name}"}`);
			card_list.push(`{"color":"b","icon":"${effect.name}"}`);
			card_list.push(`{"color":"m","icon":"${effect.name}"}`);
			card_list.push(`{"color":"o","icon":"${effect.name}"}`);
			card_list.push(`{"color":"p","icon":"${effect.name}"}`);
			card_list.push(`{"color":"s","icon":"${effect.name}"}`);
			card_list.push(`{"color":"a","icon":"${effect.name}"}`);
			card_list.push(`{"color":"i","icon":"${effect.name}"}`);
			break;
	}
}
fs.writeFile(
	path.join(uno_stew_path, `default_cards.json`),
	`{"deck":[${card_list.join(`,`)}]}`,
	(err) => {
		// In case of a error throw err.
		if (err) throw err;
	}
);
/**
 * List of all effect names.
 */
const effect_names = effect_list.map((eff) => eff.name);
const effect_texts = effect_list.map((eff) => eff.text);
// console.log("'" + effect_names.join(`\n'`));
// console.log(effect_texts.join(`\n`));
