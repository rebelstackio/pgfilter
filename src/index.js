/* src/index.js */
'use strict';

const { comesFromSTDIN } = require('./util');
const glogger = require('../lib/logger');

const init = function _init(pgfilterCLIParseOpts) {
	// console.log('=>', pgfilterCLIParseOpts);
	const debug = glogger(pgfilterCLIParseOpts.verbose);
	debug(`Starting...`);
	if (comesFromSTDIN(pgfilterCLIParseOpts)) {
		console.log(`stdin`);
	} else {
		console.log(`file`);
	}
};


module.exports = init;
