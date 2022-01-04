/* src/index.js */
'use strict';

const { comesFromSTDIN } = require('./util');

const init = function _init(pgfilterCLIParseOpts) {
	console.log('=>', pgfilterCLIParseOpts);
	if (comesFromSTDIN(pgfilterCLIParseOpts)) {
		console.log(`stdin`);
	} else {
		console.log(`file`);
	}
};


module.exports = init;
