/* src/index.js */
'use strict';

const fs = require('fs');

const { inputFromSTDIN } = require('./util');
const glogger = require('../lib/logger');
const splitter = require('../lib/splitter');
const matcher = require('../lib/matcher');

const _stdin = (analyzer, pgfilterCLIParseOpts, debug) => {
	process.stdin.setEncoding('utf8');
	process.stdin.pipe(
		splitter(null, null, {
			maxLength: pgfilterCLIParseOpts.bufferLength,
			skipOverflow: pgfilterCLIParseOpts.skipOverflow
		})
	).pipe(
		matcher(analyzer, { debug })
	).pipe(process.stdout);
};

const _file = (analyzer, pgfilterCLIParseOpts, debug) => {
	let inputfile = pgfilterCLIParseOpts.backup_file;
	fs.createReadStream(inputfile).setEncoding('utf-8').pipe(
		splitter(null, null, {
			maxLength: pgfilterCLIParseOpts.bufferLength,
			skipOverflow: pgfilterCLIParseOpts.skipOverflow
		})
	).pipe(
		matcher(analyzer, { debug })
	).pipe(process.stdout);
};

const init = function _init(pgfilterCLIParseOpts) {
	// console.log('=>', pgfilterCLIParseOpts);
	const debug = glogger(pgfilterCLIParseOpts.verbose);
	debug(`Starting...`);
	if (inputFromSTDIN(pgfilterCLIParseOpts)) {
		_stdin(null, pgfilterCLIParseOpts, debug);
	} else {
		_file(null, pgfilterCLIParseOpts, debug);
	}
};


module.exports = init;
