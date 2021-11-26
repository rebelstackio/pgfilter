#!/usr/bin/env node

'use strict';
const pfgilter = require('commander');

// const { init } = require('./src/');

const PGFILTER_VERSION = require('./package.json').version;

pfgilter
	.name('pg_restore_filter')
	.option('-f, --filter-file <filterFile>', 'Filter file . Default to /var/opt/pgfilter/pgfilter.default.json', null)
	.option('-x, --splitter-readhw <splitteReadhw>', 'ReadableHighWaterMark for the Splitter Transform stream. Default to 65536~64KB', parseInt, null)
	.option('-y, --splitter-writehw <splitteWritehw>', 'WritableHighWaterMark for the Splitter Transform stream. Default to 16384~15KB', parseInt, null)
	.option('-w, --anonymizer-readhw <anonymizerReadhw>', 'ReadableHighWaterMark for the Anonymizer Transform stream. Default to 65536~64KB', parseInt, null)
	.option('-z, --anonymizer-writehw <anonymizerWritehw>', 'WritableHighWaterMark for the Anonymizer Transform stream. Default to 16384~15KB', parseInt, null)
	.option('-l, --max-buffer-length <maxBufferLength>', 'When the internal buffer size exceeds --max-buffer-length, the stream emits an error by default. You may also set skipOverflow to true to suppress the error and instead skip past any lines that cause the internal buffer to exceed maxLength', parseInt, undefined)
	.option('-s, --skip-overflow', 'Avoid stop the streaming if the buffer exceeds. Help. Ignore line', false)
	.option('-d, --debug', 'Display more detail about parsing problems', false)
	.arguments('[inputfile]')
	.version(PGFILTER_VERSION)
	.usage('[options] [inputfile]')
	.parse(process.argv);

// init(pfgilter.opts(), pfgilter.args);
