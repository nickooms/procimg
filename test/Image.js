'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Promise = require('es6-promise').Promise;

import Image from '../src/Image';

const arnold = require('../src/arnold');

describe('Promises', function() {

	before(() => {});

	it('object comparison', function() {
		const user = { first: 'John', last: 'Matrix' };
		const p = Promise.resolve(user);
		return expect(p).to.become(user);
	});

	it('property comparison', function() {
		const name = 'Kindergarten Cop';
		const movie = { name: name, year: 1990 };
		const p = Promise.resolve(movie);
		return expect(p.then(function (o) {
			return o.name;
		})).to.become(name);
	});

	it('multiple promise assertions', function() {
		const msg1 = 'You are not you';
		const msg2 = 'You are me';
		const p1 = Promise.resolve(msg1);
		const p2 = Promise.resolve(msg2);
		return Promise.all([expect(p1).to.become(msg1), expect(p2).to.become(msg2)]);
	});

	it('comparing multiple promises', function() {
		const p1 = Promise.resolve('Get up');
		const p2 = Promise.resolve('Get down');
		return Promise.all([p1, p2]).then(function (values) {
			expect(values[0]).to.not.equal(values[1]);
		});
	});

	describe('rejected promises', function() {
		it('with a message', function () {
			const message = 'Rubber baby buggy bumpers';
			const p = Promise.reject(message);
			return expect(p).to.be.rejectedWith(message);
		});

		it('with a specific error type', function() {
			const p = Promise.reject(new TypeError('Hey, christmas tree!'));
			return expect(p).to.be.rejectedWith(TypeError);
		});
	});

	describe('Image.load', function() {
		it('return a resolved promise', function() {
			const filename = 'test/images/small.png';
			const length = 1051;
			const stub = sinon.stub();
			stub.resolves(length);
			const buffer = Image.load(filename);
			return expect(buffer).to.become(length);
		});

		it('return a rejected promise', function() {
			const filename = 'test/images/unknown.png';
			const stub = sinon.stub();
			stub.rejects(filename);
			const buffer = Image.load(filename);
			return expect(buffer).to.be.rejectedWith('no such file or directory');
		});
	});
});