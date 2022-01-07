const glogger = require('../../../lib/logger');

describe('glogger', () => {
	let cnslMock;

	beforeEach(() => {
		cnslMock = {
			warn: jest.fn()
		};
	});

	test('glogger always return a function independently of the verboseMode argument', () => {

		expect(glogger()).toBeFunction();
	});

	test('glogger returned function should avoid call the console object if the verboseMode argument is false', () => {

		let logger = glogger(false, cnslMock);
		logger(`This is a logger entry `);

		expect(cnslMock.warn).not.toHaveBeenCalled();
	});

	test('glogger returned function should call the warn method from the console object if the verboseMode argument is true', () => {

		let logger = glogger(true, cnslMock);
		logger(`This is a logger entry `);

		expect(cnslMock.warn).toHaveBeenCalled();
	});

	test('glogger returned function should call the warn method from the console object with the internal label', () => {

		let logger = glogger(true, cnslMock);
		let message1 = `This is a logger entry 1`;
		let message2 = `This is a logger entry 2`;
		logger(message1, message2);

		expect(cnslMock.warn).toHaveBeenLastCalledWith(`[pgfilter]`, message1, message2);
	});

});
