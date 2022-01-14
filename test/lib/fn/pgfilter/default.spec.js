/* test/lib/fn/pgfilter/default.spec.js */
'use strict';


const { zlen, zlar, nul } = require('../../../../lib/fn/pgfilter/default');

describe('pgfilter.default namespace function test suit', () => {

	test('zlen must always return an empty string with any argument', () => {
		expect(zlen('test')).toBe('');
	});

	test('zlar must always return \'{}\' with any argument', () => {
		expect(zlar('test')).toBe('{}');
	});

	test('nul must always return Postgres null representation \N wiht any arugment', () => {
		expect(nul('test')).toBe('\\N');
	});

});
