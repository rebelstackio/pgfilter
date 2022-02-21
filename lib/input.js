/* lib/input.js */
'use strict';

const fs = require('fs');

const { inputFromSTDIN } = require('./utils');
const splitter = require('../lib/splitter');
const matcher = require('../lib/matcher');
const Analyzer = require('../lib/analyzer');

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
	const analyzer = new Analyzer(pgfilterCLIParseOpts.file, pgfilterCLIParseOpts.verbose);
	if (inputFromSTDIN(pgfilterCLIParseOpts)) {
		_stdin(analyzer, pgfilterCLIParseOpts);
	} else {
		_file(analyzer, pgfilterCLIParseOpts);
	}
};

module.exports = init;
