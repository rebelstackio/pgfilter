/* lib/matcher/utils.js */
'use strict';

const COPY_REGEX = /^COPY [\w.\w|\w]+ \((.+)\) FROM stdin;$/gm;
const END_COPY_REGEX = /^\\\.$/gm;

const matchRegex = function _matchRegex(line, regex) {
	const result = line.match(regex);
	return !!result && result.length > 0;
};

/**
 * Check if the line is a COPY FROM stdin statement
 * @param {string} line
 * @param {Regex} regex
 */
const isStartOfCopyStatement = function _isStartOfCopyStatement(line, regex = COPY_REGEX) {
	return matchRegex(line, regex);
};

/**
 * Check if the line is a \. statement
 * @param {string} line
 * @param {Regex} regex
 */
const isEndOfCopyStatement = function _isEndOfCopyStatement(line, regex = END_COPY_REGEX) {
	return matchRegex(line, regex);
};

/**
 * Return the COPY statement as array with the following format: COPY[0] <relation>[1] (t1, t2, t3...tn)[2] FROM[3] stdin;[4]
 * @param {string} line
 */
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

/**
 * Return true if the category has a filter date category like fnow
 * @param {Array} arrAffectedColumns Array of categories(strings)
 * @param {string} category Default to 'fnow'
 */
const hasFilterCategory = function _hasFilterCategory(affectedColumn, category = 'fnow') {
	return affectedColumn.includes(category);
};

module.exports = {
	isStartOfCopyStatement,
	isEndOfCopyStatement,
	splitCopyStatement,
	hasFilterCategory
};
