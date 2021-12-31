#!/usr/bin/env node

const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { validJSONFile, validBackupFile } = require('./src/util');

const lerror = chalk.bold.red;

const pgfilter = yargs(hideBin(process.argv))
	.scriptName('pgfilter')
	.env('PGFILTER')
	.version()
	.option('f', {
		alias: 'file',
		describe: 'Path to the filtering/transformation JSON file. env: PGFILTER_FILE',
		type: 'string',
		demandOption: true,
		normalize: true,
		coerce: (f) => validJSONFile(f, 'file')
	})
	.option('b', {
		alias: 'buffer',
		describe: 'Set internal buffer size. There is no limit by default. If set, process will throw an error as soon the buffer exceed the limit. Use --skip to avoid exit the whole process. env: PGFILTER_BUFFER',
		type: 'number',
		// coerce: (b) => { if (isNaN(b)) throw new Error('err'); } FIXME: validation
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
	.usage('$0 [backup_file]', 'Filter/Transform rows during restore process for Postgres databases. For more detailed information check: https://github.com/rebelstackio/pgfilter', (yargs) => {
		yargs.positional('backup_file', {
			describe: 'Path to the Postgres Backup file.',
			type: 'string',
			default: null,
			defaultDescription: 'null. pgfilter Use STDIN by default',
			normalize: true,
			coerce: (b) => validBackupFile(b, 'backup_file')
		}).example([
			['$0 -f ~/config.json mydb.dump | psql -p "$PGPORT" --dbname=mydb', 'Restore an anonymized version of the database'],
		]);
	}).fail((msg, err, yargs) => {
		console.error(lerror(msg));
		console.warn(yargs.help());
		process.exit(1);
	}).argv;

console.log('=>', pgfilter);
console.log('=>', pgfilter.f);
// console.log('=>', argv.backup_file);
