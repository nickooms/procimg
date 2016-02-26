'use strict';

import fs from 'fs';
import Canvas from 'canvas';

class Image {

	constructor() {
	}

	static load(filename) {
		return new Promise((resolve, reject) => {
			return fs.readFile(filename, function(err, data) {
				if (err) reject(err);
				//console.log(data.length);
				resolve(data.length);
			}); 
		});
	}

}

export default Image;