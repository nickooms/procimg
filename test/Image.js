'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Promise = require('es6-promise').Promise;

import Image from '../src/Image';

const arnold = require('../src/arnold');

describe('Promises', function () {

	before(() => {});

	it('object comparison', () => {
		const user = { first: 'John', last: 'Matrix' };
		const p = Promise.resolve(user);
		return expect(p).to.become(user);
	});

	it('property comparison', () => {
		const name = 'Kindergarten Cop';
		const movie = { name: name, year: 1990 };
		const p = Promise.resolve(movie);
		return expect(p.then(function (o) {
			return o.name;
		})).to.become(name);
	});

	it('multiple promise assertions', () => {
		const msg1 = 'You are not you';
		const msg2 = 'You are me';
		const p1 = Promise.resolve(msg1);
		const p2 = Promise.resolve(msg2);
		return Promise.all([expect(p1).to.become(msg1), expect(p2).to.become(msg2)]);
	});

	it('comparing multiple promises', () => {
		const p1 = Promise.resolve('Get up');
		const p2 = Promise.resolve('Get down');
		return Promise.all([p1, p2]).then(function (values) {
			expect(values[0]).to.not.equal(values[1]);
		});
	});

	describe('rejected promises', () => {
		it('with a message', function () {
			const message = 'Rubber baby buggy bumpers';
			const p = Promise.reject(message);
			return expect(p).to.be.rejectedWith(message);
		});

		it('with a specific error type', () => {
			const p = Promise.reject(new TypeError('Hey, christmas tree!'));
			return expect(p).to.be.rejectedWith(TypeError);
		});
	});

	describe('with stubs', () => {
		it('return a resolved promise', () => {
			const filename = 'test/images/small.png';
			const length = 983;
			const stub = sinon.stub();
			stub.resolves(length);
			const buffer = Image.load(filename);
			return expect(buffer).to.become(length);
		});

		it('return a rejected promise', () => {
			const message = "I'm the party pooper";
			const stub = sinon.stub();
			stub.rejects(message);
			const a = arnold(stub);
			const quote = a.talkToTheHand();
			return expect(quote).to.be.rejectedWith(message);
		});
	});
});

/*'use strict';

import { createGroup, assert } from 'painless';
import Image from '../src/Image';

const test = createGroup();

test('sync test', () => {
  assert.deepEqual({ a: '1' }, { a: '1' });
});

test('promise test', () => {
	const FILENAME = `test/images/small.png`;
	//const FILENAME = `test/images/GRB_WGO__152550.96,221839.05,152582.63,221870.31.png`;
	//console.log(Image);
	//for (let a in Image) console.log(a);
	let promise = Image.load(FILENAME);
	promise.then(f => {
		console.log(a);
	})
	//console.log(promise);

  return assert.eventually.deepEqual(promise.length, 983);
});
*/