/* test/src/util.spec.js */

const { validJSONFile, handleSysErrors, validBackupFile, validBuffer, inputFromSTDIN } = require('../../src/util');

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

	describe('validBackupFile', () => {

		test('validBackupFile must throw an error if the file does not exists', () => {
			expect(() => {
				validBackupFile(`/tmp/dump${rn()}.dump`);
			}).toThrow();
		});

		test('validBackupFile must not throw an error if the file is null( STDIN ) and return null', () => {
			expect(validBackupFile(null)).toBe(null);
		});

	});

	describe('validBuffer', () => {

		test('validBuffer must throw an error if the buffer is NaN', () => {
			expect(() => {
				validBuffer(`NaN`);
			}).toThrow(TypeError);
		});

		test('validBuffer must return the buffer if it is valid', () => {
			expect(validBuffer(30)).toBe(30);
		});

		test('validBuffer must round the buffer if it is a fractional number', () => {
			expect(validBuffer(30.1)).toBe(30);
			expect(validBuffer(30.9)).toBe(31);
		});

	});

	describe('inputFromSTDIN', () => {
		test('inputFromSTDIN must return true if the \'backup_file\' property is not present in the yargs parsed object', () => {
			const yargsCLIOptsParsed = {
				b: 0,
				'buffer-length': 0,
				bufferLength: 0,
				s: false,
				'skip-overflow': false,
				skipOverflow: false,
			};

			expect(inputFromSTDIN(yargsCLIOptsParsed)).toBe(true);
		});

		test('inputFromSTDIN must return true if the \'backup_file\' property is null', () => {
			const yargsCLIOptsParsed = {
				b: 0,
				'buffer-length': 0,
				bufferLength: 0,
				s: false,
				'skip-overflow': false,
				skipOverflow: false,
				backup_file: null
			};

			expect(inputFromSTDIN(yargsCLIOptsParsed)).toBe(true);
		});

		test('inputFromSTDIN must return false if the \'backup_file\' property is as valid file path', () => {
			const yargsCLIOptsParsed = {
				b: 0,
				'buffer-length': 0,
				bufferLength: 0,
				s: false,
				'skip-overflow': false,
				skipOverflow: false,
				backup_file: '/backups/my_backup.dump'
			};

			expect(inputFromSTDIN(yargsCLIOptsParsed)).toBe(false);
		});
	});
});

