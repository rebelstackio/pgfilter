/* src/index.js */
'use strict';

const { comesFromSTDIN } = require('./util');
const { gverbose } = require('../lib/utils');

const init = function _init(pgfilterCLIParseOpts) {
	// console.log('=>', pgfilterCLIParseOpts);
	const debug = gverbose(pgfilterCLIParseOpts.verbose);
	debug(`Starting...`);
	if (comesFromSTDIN(pgfilterCLIParseOpts)) {
		console.log(`stdin`);
	} else {
		console.log(`file`);
	}
};


module.exports = init;
