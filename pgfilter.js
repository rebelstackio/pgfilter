#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
	.scriptName('pgfilter')
	.usage('$0 [options] [backup_file]')
	.env('PGFILTER')
	.version()
	.option('f', {
		alias: 'ffile',
		describe: 'Path to the filtering/transformation JSON file. env: PGFILTER_FFILE',
		type: 'string'
	}).normalize('f')
	.option('b', {
		alias: 'buffer',
		describe: 'Set internal buffer size. There is no limit by default. If set, process will throw an error as soon the buffer exceed the limit. Use --skip to avoid exit the whole process. env: PGFILTER_BUFFER',
		type: 'number'
	})
	.option('s', {
		alias: 'skip',
		describe: 'If set, the line that exceed the internal buffer will be ignored and the process will not exit. env: PGFILTER_SKIP',
		type: 'boolean'
	})
	.option('v', {
		alias: 'verbose',
		describe: 'Show debug messages in STDERR',
		type: 'boolean'
	})
	.positional('backup_file', {
		describe: 'Path to the Postgres Backup file.',
		type: 'string',
		default: null,
		defaultDescription: 'null. Use STDIN if not present'
	})
	.demandOption(['f'])
	.example([
		['$0 -f ~/config.json mydb.dump | psql -p "$PGPORT" --dbname=mydb', 'Restore an anonymized version of a database'],
	])
	.parse();

console.log('=>', argv);
// console.log('=>', argv.f);
