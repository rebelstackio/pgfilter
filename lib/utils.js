/* lib/utils.js */
'use strict';

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

const gverbose = (verboseMode = false, cnsl = console) => {
	return function _log() {
		if (verboseMode) {
			cnsl.warn(`[pgfilter]`, ...arguments);
		}
	};
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

module.exports = {
	isStartOfCopyStatement,
	isEndOfCopyStatement,
	splitCopyStatement,
	isAFilterFn,
	gverbose
};
