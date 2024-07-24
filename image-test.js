const { Image, Shape } = require("image-js");
const distance = (x, y, x_2, y_2) => {
	return Math.sqrt(Math.pow(x - x_2, 2) + Math.pow(y - y_2, 2));
};
const border = 30;
async function cardBase(savePath) {
	const image = new Image(400, 700);

	for (let y = 0; y < image.height; y++) {
		for (let x = 0; x < image.width; x++) {
			const left_edge = x < border;
			const right_edge = x > image.width - border;
			const top_edge = y < border;
			const bottom_edge = y > image.height - border;
			const vertical_distance = Math.min(
				Math.abs(border - y),
				Math.abs(image.height - y - border)
			);
			const horizontal_distance = Math.min(
				Math.abs(border - x),
				Math.abs(image.width - x - border)
			);
			image.setPixelXY(x, y, [255, 255, 255, 255]);
			const corner =
				(right_edge || left_edge) && (bottom_edge || top_edge);
			if (corner) {
				image.setPixelXY(x, y, [255, 255, 255, 0]);
			}
			if (
				Math.sqrt(
					vertical_distance * vertical_distance +
						horizontal_distance * horizontal_distance
				) < border
			) {
				image.setPixelXY(x, y, [255, 255, 255, 255]);
			}
		}
	}
	return image.save(savePath);
}
// cardBase(`base.png`);
const layer_border = 50;
async function color_layer(color, savePath) {
	const color_map = new Map();
	color_map.set(`red`, [255, 0, 0, 255]);
	color_map.set(`green`, [0, 255, 0, 255]);
	color_map.set(`blue`, [0, 0, 255, 255]);
	color_map.set(`yellow`, [255, 255, 0, 255]);
	color_map.set(`wild`, [0, 0, 0, 255]);
	const c = color_map.get(color);
	// Load the images
	const image1 = await Image.load(`base.png`);

	// Create a new image to store the result
	const image = Image.createFrom(image1);

	for (let y = 0; y < image.height; y++) {
		for (let x = 0; x < image.width; x++) {
			const pixel1 = image1.getPixelXY(x, y);
			image.setPixelXY(x, y, pixel1);

			const border1 = layer_border - border;
			const border2 = layer_border;
			const left_edge = x < border2 && x > border1;
			const right_edge =
				x > image.width - border2 && x < image.width - border1;
			const top_edge = y < border2 && y > border1;
			const bottom_edge =
				y > image.height - border2 && y < image.height - border1;
			const checks = [left_edge, right_edge, top_edge, bottom_edge];
			const outside =
				x < border1 + 1 ||
				x > image.width - border1 - 1 ||
				y < border1 + 1 ||
				y > image.height - border1 - 1;
			const vertical_distance = Math.min(
				Math.abs(layer_border - y),
				Math.abs(image.height - y - layer_border)
			);
			const coord_values = [
				layer_border,
				image.width - layer_border,
				image.height - layer_border,
			];
			const coords = [
				[coord_values[0], coord_values[0]],
				[coord_values[0], coord_values[2]],
				[coord_values[1], coord_values[0]],
				[coord_values[1], coord_values[2]],
			];
			const horizontal_distance = Math.min(
				Math.abs(layer_border - x),
				Math.abs(image.width - x - layer_border)
			);

			if (
				coords.reduce(
					(acc, cv) => acc || distance(x, y, ...cv) < border,
					false
				) ||
				(!((left_edge || right_edge) && (top_edge || bottom_edge)) &&
					(left_edge || right_edge || top_edge || bottom_edge) &&
					!outside)
			) {
				image.setPixelXY(x, y, c);
			}
		}
	}

	return image.save(savePath);
}
//color_layer(`red`, `red_card.png`);

async function add_shape(savePath) {
	// Load the images
	const image1 = await Image.load(`red_card.png`);
	// Create a new image to store the result
	const image = Image.createFrom(image1);
	const radius = 150;
	for (let y = 0; y < image.height; y++) {
		for (let x = 0; x < image.width; x++) {
			const pixel1 = image1.getPixelXY(x, y);
			image.setPixelXY(x, y, pixel1);
			if (
				x + y > (image.height + image.width) / 2 - radius &&
				x + y < (image.height + image.width) / 2 + radius &&
				image.width - x + y >
					(image.height + image.width) / 2 - radius &&
				image.width - x + y < (image.height + image.width) / 2 + radius
			) {
				image.setPixelXY(x, y, [255, 255, 255, 255]);
			}
		}
	}
	return image.save(savePath);
}
add_shape(`star_card.png`);
