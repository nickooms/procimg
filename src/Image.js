'use strict';

import fs from 'fs';
import Canvas from 'canvas';

function sortColors(a, b) {
	return a.count < b.count ? 1 : (a.count === b.count ? 0 : -1);
}

function rgb(color) {
	let
		r = (color) & 0xff,
		g = (color >> 8) & 0xff,
		b = (color >> 16) & 0xff;
	return { r, g, b };
}

function rgb2int(red, green, blue) {
  return (
    ((red   >> 5) << 6) |
    ((green >> 5) << 3) |
    ((blue  >> 5) << 0)
  );
}

function int(color) {
	let c = rgb(color);
	return rgb2int(c.r, c.g, c.b);
}

class Image {

	constructor(image) {
		this.filename = image.filename;
		this.filesize = image.filesize;
		this.width = image.width;
		this.height = image.height;
		this.canvas = image.canvas;
		this.context = image.context;
	}

	get colorCount() {
		const data = this.data32;
		const length = data.length;
		const colors = new Set();
		for (var i = 0; i < length; i++) {
			colors.add(data[i]);
		}
		return colors.size;
	}

	get colors() {
		const data = this.data32;
		const length = data.length;
		const colors = new Map();
		for (let i = 0; i < length; i++) {
			let pixel = data[i];
			if (!colors.has(pixel)) {
				colors.set(pixel, 0);
			}
			colors.set(pixel, colors.get(pixel) + 1);
		}
		const colorList = [...colors.entries()].map(color => {
			let value = color[0];
			let count = color[1];
			return {
				value,
				count,
				color: '#' + value.toString(16),
				int: int(value)
			};
		});
		colorList.sort(sortColors);
		//console.log('colors', colorList.length);
		return colorList;
	}

	get imageData() {
		return this.context.getImageData(0, 0, this.width, this.height);
	}

	get data() {
		return this.imageData.data;
	}

	get data32() {
		return new Uint32Array(this.data.buffer);
	}

	save(filename) {
		fs.writeFileSync(filename, this.canvas.toBuffer(), 'binary');
	}

	replace(color, newColor, maxDeviation) {
		maxDeviation = maxDeviation || 10;
		const colors = this.colors;
		const imageData = this.imageData;
		const data = new Uint32Array(imageData.data.buffer);
		const length = data.length;
		const colorMap = new Map();
		const intColor = int(color);
		colors.forEach(color => colorMap.set(color.value, color.int));
		let replaced = 0;
		for (let i = 0; i < length; i++) {
			let pixel = data[i];
			let intPixel = colorMap.get(pixel);
			if (Math.abs(intPixel - intColor) <= maxDeviation) {
				replaced++;
				data[i] = newColor;
			}
		}
		//console.log('replaced', replaced);
		this.context.putImageData(imageData, 0, 0);
	}

	static load(filename) {
		return new Promise((resolve, reject) => {
			return fs.readFile(filename, function(err, file) {
				if (err) return reject(err);
				const filesize = file.length;
				const img = new Canvas.Image(file);
				img.src = file;
				const width = img.width;
				const height = img.height;
				const canvas = new Canvas(width, height);
				const context = canvas.getContext('2d');
				context.drawImage(img, 0, 0, width, height);
				const image = new Image({ filename, filesize, width, height, canvas, context });
				resolve(image);
			}); 
		});
	}

	static rgb(color) {
		let r = color & 0xff;
		let g = (color >> 8) & 0xff;
		let b = (color >> 16) & 0xff;
		return `rgb(${r},${g},${b})`;
	}

	static inverse(color) {
		let r = 0xff - (color & 0xff);
		let g = 0xff - ((color >> 8) & 0xff);
		let b = 0xff - ((color >> 16) & 0xff);
		return `rgb(${r},${g},${b})`;
	}

	static html(colors) {
		const rows = colors.map(color => `<tr style="color: ${Image.inverse(color.value)}; background-color: ${Image.rgb(color.value)};">
			<td>${color.color}</td>
			<td align="right">${color.count}</td>
			<td align="right">${color.int}</td>
			<td align="right">${color.value}</td>
		</tr>`);
		return `<html>
			<head>
				<style>
					td {
						padding: 0px 5px;
					}
				</style>
			</head>
			<body>
				<table style="color: #fff;">
					<tr bgcolor="#000">
						<th colspan="4">${colors.length} Colors</th>
					</tr>
					<tr bgcolor="#000">
						<th>Color</th>
						<th>Count</th>
						<th>Int</th>
						<th>Value</th>
					</tr>
					${rows.join('\n')}
				</table>
			</body>
		</html>`;
	}

}

export default Image;