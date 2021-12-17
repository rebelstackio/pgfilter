#!/usr/bin/env node

'use strict';
const pfgilter = require('commander');

// const { init } = require('./src/');

const PGFILTER_VERSION = require('./package.json').version;

pfgilter
	.name('pgfilter')
	.requiredOption('-f, --pgfilter-file <pgfilterFile>', 'Path to the filtering/transformation JSON file')
	.option('-l, --max-buffer-length <maxBufferLength>', 'Set internal buffer size. There is no limit by default. If set, process will throw an error as soon the buffer exceed the limit. Use --skip-overflow to avoid exit the whole process.', parseInt, undefined)
	.option('-s, --skip-overflow', 'If set, the line that exceed the internal buffer will be ignored and the process will not exit', false)
	.option('-d, --debug', 'Show debug messages in stderr', false)
	.arguments('[inputfile]')
	.version(PGFILTER_VERSION)
	.usage('[options] [inputfile]')
	.parse(process.argv);

// init(pfgilter.opts(), pfgilter.args);
