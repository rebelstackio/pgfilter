#!/usr/bin/env node

'use strict';
const { Command, Option } = require('commander');
const pfgilter = new Command();

const init = require('./src/');

const PGFILTER_VERSION = require('./package.json').version;

pfgilter
	.name('pgfilter')
	.addOption(
		new Option('-f, --pgfilter-file <pgfilterFile>',
			'Path to the filtering/transformation JSON file.'
		).env(
			'PGFILTER_FILE'
		).required = true
	)
	// .option('-l, --max-buffer-length <maxBufferLength>', 'Set internal buffer size. There is no limit by default. If set, process will throw an error as soon the buffer exceed the limit. Use --skip-overflow to avoid exit the whole process.', parseInt, undefined).env('PGFILTER_BUFFER').option('-s, --skip-overflow', 'If set, the line that exceed the internal buffer will be ignored and the process will not exit', false)
	// .option('-d, --debug', 'Show debug messages in stderr', false)
	.arguments('[inputfile]')
	.version(PGFILTER_VERSION)
	.usage('[options] [inputfile]')
	.parse(process.argv);

init(pfgilter.opts(), pfgilter.args);
