/* test/src/util.spec.js */

const { validJSONFile, handleSysErrors } = require('../../src/util');

const rn = () => Math.random() * 1000

describe('utils test suit', () => {

	describe('handleSysErrors', () => {
		test('handleSysErrors must always return an Error instance', () => {
			const err = new Error(`custom err`);
			expect(handleSysErrors(err, 'arg1')).toBeInstanceOf(Error);
		});

		test('handleSysErrors must change the error message if the original error code is EONET', () => {
			const err = new Error(`custom err`);
			err.code = 'ENOENT';

			let nerr = handleSysErrors(err, 'arg1')
			expect(nerr).toBeInstanceOf(Error);
			expect(nerr.message).toMatch(/'arg1' must be a valid file path/);
		});

		test('handleSysErrors must change the error message if the original error code is EACCES', () => {
			const err = new Error(`custom err`);
			err.code = 'EACCES';

			let nerr = handleSysErrors(err, 'arg1')
			expect(nerr).toBeInstanceOf(Error);
			expect(nerr.message).toMatch(/'arg1' needs read permissions/);
		});

		test('handleSysErrors must change the error message if the original error is instance of SyntaxError', () => {
			const err = new SyntaxError(`json parsing error`);
			let nerr = handleSysErrors(err, 'arg1')
			expect(nerr).toBeInstanceOf(SyntaxError);
			expect(nerr.message).toMatch(/'arg1' must be a valid JSON document/);
		});

		test('handleSysErrors must use the original error message if it is a no-handle error', () => {
			const err = new Error(`custom err`);
			let nerr = handleSysErrors(err, 'arg1')
			expect(nerr).toBeInstanceOf(Error);
			expect(nerr.message).toMatch(/custom err/);
		});
	});

	describe('validJSONFile', () => {

		const fs = require('fs');
		jest.mock('fs');

		test('validJSONFile must throw an error if the file does not exists', () => {
			expect(() => {
				validJSONFile(`/tmp/test${rn()}.json`);
			}).toThrow();
		});

		test('validJSONFile must throw an error if the file is not a valid JSON file', () => {
			fs.readFileSync = jest.fn();
			fs.readFileSync.mockImplementation(() => `a single string`);
			expect(() => {
				validJSONFile(`/tmp/test${rn()}.json`);
			}).toThrow();
		});
	});

	describe('validFile', () => {

		test('validFile must throw an error if the file does not exists', () => {
			expect(() => {
				validFile(`/tmp/dump${rn()}.dump`);
			}).toThrow();
		});

	});
});

