/* src/index.js */
'use strict';

const fs = require('fs');

const { inputFromSTDIN } = require('./util');
const splitter = require('../lib/splitter');
const matcher = require('../lib/matcher');

const _stdin = (analyzer, pgfilterCLIParseOpts) => {
	process.stdin.setEncoding('utf8');
	process.stdin.pipe(
		splitter(null, null, {
			maxLength: pgfilterCLIParseOpts.bufferLength,
			skipOverflow: pgfilterCLIParseOpts.skipOverflow
		})
	).pipe(
		matcher(analyzer)
	).pipe(process.stdout);
};

const _file = (analyzer, pgfilterCLIParseOpts) => {
	let inputfile = pgfilterCLIParseOpts.backup_file;
	fs.createReadStream(inputfile).setEncoding('utf-8').pipe(
		splitter(null, null, {
			maxLength: pgfilterCLIParseOpts.bufferLength,
			skipOverflow: pgfilterCLIParseOpts.skipOverflow
		})
	).pipe(
		matcher(analyzer)
	).pipe(process.stdout);
};

const init = function _init(pgfilterCLIParseOpts) {
	if (inputFromSTDIN(pgfilterCLIParseOpts)) {
		_stdin(null, pgfilterCLIParseOpts);
	} else {
		_file(null, pgfilterCLIParseOpts);
	}
};

module.exports = init;
