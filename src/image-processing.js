'use strict';

import Image from './Image';

function getSize(filename) {
	const image = new Image();
	return image.load(filename).then((file) => {
		console.log('file = ', file);
	});
}

const ImageProcessing = {
	getSize
};

export default ImageProcessing;