'use strict';

import fs from 'fs';
import Image from '../src/Image';

const expect = require('chai').expect;
const sinon = require('sinon');
const Promise = require('es6-promise').Promise;

const FOLDER = 'test/images/WPI';
const LAYER = 'WPI';
const BBOX = '152484.40,221796.27,152546.04,221847.22';
const FILENAME = `${FOLDER}/GRB_${LAYER}__${BBOX}.png`;
const FILESIZE = 4460;
const COLOR_COUNT = 79;

describe(`${LAYER} LAYER`, function() {

	let loadedImage;

	before(function() {
		loadedImage = Image.load(FILENAME);
	});

	it('is an image', function() {
		return expect(loadedImage).to.eventually.be.an.instanceof(Image);
	});

	it(`has the correct (${FILESIZE} bytes) filesize`, function() {
		return expect(loadedImage).to.eventually.have.property('filesize', FILESIZE);
	});

	it(`contains exactly ${COLOR_COUNT} colors`, function() {
		const colorCount = loadedImage.then(image => image.colorCount);
		return expect(colorCount).to.eventually.equal(COLOR_COUNT);
	});

	it(`has colors`, function() {
		const colors = loadedImage.then(image => {
			const colors = image.colors;
			fs.writeFileSync('test/output/colors.html', Image.html(colors));
			return colors;
		});
		return expect(colors).to.eventually.have.property('length', COLOR_COUNT);
	});

	it(`replaces brown`, function() {
		const brown = 4279520408;
		const colors = loadedImage.then(image => {
			image.replace(brown, brown, 72);
			const colors = image.colors;
			fs.writeFileSync('test/output/replaced-brown.html', Image.html(colors));
			return colors;
		});
		return expect(colors).to.eventually.have.property('length', 46);
	});

	it(`replaces purple`, function() {
		const white = 4294638330;
		const colors = loadedImage.then(image => {
			image.replace(white, white, 50);
			const colors = image.colors;
			fs.writeFileSync('test/output/replaced-white.html', Image.html(colors));
			return colors;
		});
		return expect(colors).to.eventually.have.property('length', 26);
	});

	it(`replaces purple`, function() {
		const pink = 4288086231;
		const colors = loadedImage.then(image => {
			image.replace(pink, pink, 50);
			const colors = image.colors;
			fs.writeFileSync('test/output/replaced-pink.html', Image.html(colors));
			return colors;
		});
		return expect(colors).to.eventually.have.property('length', 4);
	});

});