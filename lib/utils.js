/* lib/utils.js */
'use strict';

const fs = require('fs');

const COPY_REGEX = /^COPY [\w.\w|\w]+ \((.+)\) FROM stdin;$/gm;
const END_COPY_REGEX = /^\\\.$/gm;

const matchRegex = function _matchRegex(line, regex) {
	const result = line.match(regex);
	return !!result && result.length > 0;
};

const isStartOfCopyStatement = function _isStartOfCopyStatement(line, regex = COPY_REGEX) {
	return matchRegex(line, regex);
};

const isEndOfCopyStatement = function _isEndOfCopyStatement(line, regex = END_COPY_REGEX) {
	return matchRegex(line, regex);
};

const splitCopyStatement = function _splitCopyStatement(line) {
	const tokens = line.split(' ');
	return [
		tokens[0],
		tokens[1],
		tokens.slice(2, tokens.length - 2).join(' '),
		tokens[tokens.length - 2],
		tokens[tokens.length - 1]
	];
};

const isAFilterFn = function _isAFilterFn(fnName) {
	try {
		let tkns = fnName.split('.');
		if (tkns.length === 3) {
			return tkns[0] === 'pgfilter' && tkns[1] === 'filter';
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

const handleSysErrors = (err, arg = 'argument') => {
	switch (true) {
		case err.code === 'ENOENT':
			err.message = `'${arg}' must be a valid file path`;
			break;
		case err.code === 'EACCES':
			err.message = `'${arg}' needs read permissions`;
			break;
		case err instanceof SyntaxError:
			err.message = `'${arg}' must be a valid JSON document`;
			break;
	}
	return err;
};

const validJSONFile = (file, arg) => {
	let parsed, err = null;
	try {
		parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
	} catch (error) {
		err = handleSysErrors(error, arg);
	}

	if (err) {
		throw err;
	}

	return parsed;
};

const validFile = (file, arg) => {
	let err = null;
	try {
		fs.accessSync(file, fs.constants.R_OK);
	} catch (error) {
		err = handleSysErrors(error, arg);
	}

	if (err) {
		throw err;
	}

	return file;
};

const validBackupFile = (file, arg) => {
	if (file === null) {
		return file;
	}

	return validFile(file, arg);
};

const validBuffer = (buffer, arg) => {
	let err = null;
	if (buffer !== undefined) {
		if (isNaN(buffer)) {
			err = handleSysErrors(
				new TypeError(`'${arg}' must be a integer`),
				arg
			);
		}

		if (err) {
			throw err;
		}

		return Math.round(buffer);
	}
	return buffer;
};

const inputFromSTDIN = (yargsParsedOpts, prop = 'backup_file') => {
	if (Object.prototype.hasOwnProperty.call(yargsParsedOpts, prop)) {
		return yargsParsedOpts[prop] === null;
	} else {
		return true;
	}
};

module.exports = {
	isStartOfCopyStatement,
	isEndOfCopyStatement,
	splitCopyStatement,
	isAFilterFn,
	validJSONFile,
	validBackupFile,
	handleSysErrors,
	validBuffer,
	inputFromSTDIN
};
