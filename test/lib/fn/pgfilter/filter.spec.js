/* test/lib/fn/pgfilter/default.spec.js */
'use strict';

const MockDate = require('mockdate');

const { fnow } = require('../../../../lib/fn/pgfilter/filter');

describe('pgfilter.filter namespace function test suit', () => {

	describe('fnow', () => {

		test('fnow must throw an exception if the range argument is not valid', () => {
			let rangeF = null;
			const column = '2020-11-09T18:41:14.419Z';

			expect(() => {
				fnow(column, rangeF);
			}).toThrow(Error);

			rangeF = undefined;
			expect(() => {
				fnow(column, rangeF);
			}).toThrow(Error);

			rangeF = true;
			expect(() => {
				fnow(column, rangeF);
			}).toThrow(Error);

			rangeF = 9099;
			expect(() => {
				fnow(column, rangeF);
			}).toThrow(Error);
		});

		test('fnow must return false on P30D of 2020-11-09T18:41:14.419Z', () => {
			const rangeF = 'P30D';
			const column = '2020-11-09T18:41:14.419Z';

			let result;
			MockDate.set('2020-11-09');
			result = fnow(column, rangeF);

			expect(result).toBe(false);
		});

		test('fnow must return true on P30D of 2010-11-09T18:41:14.419Z', () => {
			const rangeF = 'P30D';
			const column = '2010-11-09T18:41:14.419Z';

			let result;
			MockDate.set('2020-11-09');
			result = fnow(column, rangeF);

			expect(result).toBe(true);
		});

		test('fnow must return true on P2D of 2020-11-05T18:41:14.419Z', () => {
			const rangeF = 'P2D';
			const column = '2020-11-05 14:22:48.672979-06';

			let result;
			MockDate.set('2020-11-09');
			result = fnow(column, rangeF);

			expect(result).toBe(true);
		});

		test('fnow should be exact on the compares', () => {
			const rangeF = 'P1D';
			let column = '2020-11-07T18:41:14.419Z';

			let result;
			MockDate.set('2020-11-08T18:41:14.419Z');
			result = fnow(column, rangeF);

			expect(result).toBe(false);

			MockDate.set('2020-11-08T18:42:14.419Z');
			result = fnow(column, rangeF);
			expect(result).toBe(true);
		});

		test('fnow must return true on P20D of 2017-11-29T09:45:10.000Z', () => {
			const rangeF = 'P20D';
			let column = '2017-11-29T09:45:10.000Z';

			let result;
			MockDate.set('2020-11-09T20:13:47.949Z');
			result = fnow(column, rangeF);

			expect(result).toBe(true);
		});

		test('fnow must return true on P1Y of 2008-11-29T09:25:20.000Z', () => {
			const rangeF = 'P1Y';
			let column = '2015-03-03 13:57:54.856896';

			let result;
			MockDate.set('2021-01-13T17:12:46.980Z');
			result = fnow(column, rangeF);

			expect(result).toBe(true);
		});

		test('fnow must return false on P1Y of 2020-11-29T09:25:20.000Z', () => {
			const rangeF = 'P1Y';
			let column = '2020-11-29T09:25:20.000Z';

			let result;
			MockDate.set('2021-01-13T17:12:46.980Z');
			result = fnow(column, rangeF);

			expect(result).toBe(false);
		});

		test('fnow must return false on P1Y on a recent date', () => {
			const rangeF = 'P1Y';
			let column = '2021-01-01T17:13:46.980Z';

			let result;
			MockDate.set('2021-01-01T17:12:46.980Z');
			result = fnow(column, rangeF);

			expect(result).toBe(false);
		});
	});

});
