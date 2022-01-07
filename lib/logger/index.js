/* lib/logger/index.js */

const glogger = (verboseMode = false, cnsl = console) => {
	return function _log() {
		if (verboseMode) {
			cnsl.warn(`[pgfilter]`, ...arguments);
		}
	};
};

module.exports = glogger;
