/* test/src/util.spec.js */

const { validJSONFile } = require('../../src/util');



const rn = () => Math.random() * 1000


describe('utils test suit', () => {

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
});

