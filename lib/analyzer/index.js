/* lib/analyzer/index.js */
'use strict';

const { isAFilterFn, splitCopyStatement } = require('../utils');
const FN = require('../fn');

class Analyzer {
	constructor(mapper, onVerboseMode = false) {
		this._relation = null;
		this._columns = null;

		// Array to keep indexes of columns that requires transformation e.g [ 2, 3, 6] Columns 2, 3 and 6 must be transformed
		this._affectedTransColnsIdx = [];
		// Array to keep category values for _affectedTransColnsIdx variable [ 'sor.name.fn1', 'sor.name.cat2', 'sor.name.cat5']
		// Column 2 must use function sor.name.fn1, column 3 must use function sor.name.cat2 and column 6 must use sor.name.cat5
		this._affectedTransColnFn = [];
		// Array to keep indexes of columns that requires filtering e.g [ 2, 3, 6] Columns 2, 3 and 6 must be filtered
		this._affectedFiltrColnsIdx = [];
		// Array to keep category values for _affectedFiltrColnsIdx variable [ 'sor.name.fn1', 'sor.name.cat2', 'sor.name.cat5']
		// Column 2 must use function sor.name.fn1, column 3 must use function sor.name.cat2 and column 6 must use sor.name.cat5
		this._affectedFiltrColnsFn = [];
		// pgfilter file already parsed
		this._mapper = mapper;
		this._onVerboseMode = onVerboseMode;
	}

	/**
	 * Analyze line with a COPY statement line. Return the table name if the line has a table in the pgfilter file
	 * @param {string} line
	 */
	check(line) {
		try {
			const copyArrTkns = splitCopyStatement(line);// ['COPY', <relation>, <columns>, 'FROM', 'stdin;']
			if (copyArrTkns) {
				this._setMappedRelation(copyArrTkns);
				if (this._relation) {
					// Set the columns
					this._setColumnsFromLine(copyArrTkns);
					// Set index position of columns that requires transformation with the function from the mapper file
					this._setAffectedColumns();
					if (this._onVerboseMode) {
						console.warn('[pgfilter] Relation for trasnformation/filtering found:', this._relation);
					}
				}
				return this._relation;
			}
		} catch (error) {
			console.warn(`[pgfilter] Error analyzing line: ${line}`, error);
			// Ignore this line
			return false;
		}
	}

	/**
	 * Apply filterin/transformation to the line
	 * @param {string} lineWithData
	 */
	apply(lineWithData) {
		let nline = lineWithData;
		let tkns = lineWithData.split('\t');
		if (this._affectedFiltrColnsFn.length > 0 && this._affectedFiltrColnsIdx.length > 0) {
			if (this._filter(tkns)) {
				nline = null;
			}
		}

		if (this._affectedTransColnsIdx.length > 0 && this._affectedTransColnFn.length > 0 && nline) {
			nline = this._transform(tkns);
		}

		return nline;
	}

	_transform(colValTkns) {
		this._affectedTransColnsIdx.forEach((indexv, i) => {
			colValTkns[indexv] = this._applyFn(
				this._affectedTransColnFn[i],
				// colValTkns[indexv]
			);
		});
		return colValTkns.join('\t');
	}

	_filter(colValTkns) {
		let filtered = false;
		this._affectedFiltrColnsIdx.forEach((indexv, i) => {
			filtered = filtered || this._applyFn(
				this._affectedFiltrColnsFn[i],
				colValTkns[indexv]
			);
		});
		return filtered;
	}

	/**
	 * Clean metadata
	 */
	reset() {
		this._relation = null;
		this._columns = null;
		this._affectedTransColnsIdx = [];
		this._affectedTransColnFn = [];
		this._affectedFiltrColnsIdx = [];
		this._affectedFiltrColnsFn = [];
	}

	_applyFn(fnLabel, val = undefined) {
		let [source, nm, fnsig] = fnLabel.split('.');
		let [fn, ...args] = fnsig.split('-');
		try {
			const _fn = FN[source][nm][fn];
			return _fn(val, ...args);
		} catch (error) {
			console.warn(`[pgfilter] Error trying to call function ${fnLabel}`, error);
			return val;
		}
	}

	/**
	 * Map the table name if it is present in the pgfilter file
	 * @param {Array} tokens ['COPY', <relation>, <columns>, 'FROM', 'stdin;']
	 */
	_setMappedRelation(tokens) {
		if (tokens) {
			if (this._mapper[tokens[1]]) {
				this._relation = tokens[1];
			} else {
				this._relation = null;
			}
		} else {
			this._relation = null;
		}
	}

	/**
	 * Clean the columns and store it for later replacement as an array [col1, col2...coln]
	 * in the attributte this._columns
	 * @param {Array} tokens ['COPY', <relation>, <columns>, 'FROM', 'stdin;']
	 */
	_setColumnsFromLine(tokens) {
		if (tokens) {
			let columns = tokens[2];
			this._columns = columns.split(' ').map((mcol) => {
				let tmpcol = mcol.replace('(', '');
				tmpcol = tmpcol.replace(')', '');
				tmpcol = tmpcol.replace(',', '');
				return tmpcol;
			});
		} else {
			this._columns = null;
		}
	}

	/**
	 * Store  affected columns by index and the function label by index
	 */
	_setAffectedColumns() {
		if (this._relation && this._columns) {
			if (this._mapper && this._mapper[this._relation]) {
				const transfColumns = this._mapper[this._relation];
				// Get the affected columns indexes for transformation or filtering on the current COPY statement
				let affectedColnsIdx = Object.keys(transfColumns).map(c => this._columns.indexOf(c)).filter(c => c !== -1);
				affectedColnsIdx.forEach(colIdx => {
					let fn = transfColumns[this._columns[colIdx]];
					if (isAFilterFn(fn)) {
						this._affectedFiltrColnsIdx.push(colIdx);
						this._affectedFiltrColnsFn.push(fn);
					} else {
						this._affectedTransColnsIdx.push(colIdx);
						this._affectedTransColnFn.push(fn);
					}
				});
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	get relation() {
		return this._relation;
	}

	get columns() {
		return this._columns;
	}

	get affectedTransColnsIdx() {
		return this._affectedTransColnsIdx;
	}

	get affectedTransColnFn() {
		return this._affectedTransColnFn;
	}

	get affectedFiltrColnsIdx() {
		return this._affectedFiltrColnsIdx;
	}

	get affectedFiltrColnsFn() {
		return this._affectedFiltrColnsFn;
	}

	get onVerboseMode() {
		return this._onVerboseMode;
	}

}

module.exports = Analyzer;
