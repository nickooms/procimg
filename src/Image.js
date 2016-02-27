'use strict';

import fs from 'fs';
import Canvas from 'canvas';

class Image {

	constructor(image) {
		/*this.filename = image.filename;
		this.filesize = image.filesize;
		this.width = image.width;
		this.height = image.height;
		this.canvas = image.canvas;
		this.context = image.context;*/
	}

	static load(filename) {
		return new Promise((resolve, reject) => {
			return fs.readFile(filename, function(err, file) {
				if (err) return reject(err);
				const filesize = file.length;
				const img = new Canvas.Image(file);
				
				
				
				
				img.src = file;
				//console.log(img.width);
				const width = img.width;
				const height = img.height;
				const canvas = new Canvas(width, height);
				const context = canvas.getContext('2d');
				context.drawImage(img, 0, 0, width, height);
				const imageData = context.getImageData(0, 0, width, height);
				const data = new Uint32Array(imageData.data.buffer);
				
				//console.log(data.length);

				/*const canvas2 = new Canvas(w, h, 'svg');
				const ctx2 = canvas2.getContext('2d');
				ctx2.putImageData(imageData, 0, 0, w, h);
				fs.writeFile('out.svg', canvas2.toBuffer());*/

				resolve(filesize);
			}); 
		});
	}

}

export default Image;