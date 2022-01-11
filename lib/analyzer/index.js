/* lib/analyzer/index.js */
'use strict';

const { isAFilterFn } = require('../utils');

class Analyzer {
	constructor(mapper, debug) {
		this._relation = null;
		this._columns = null;
		this._hasAFilterFn = false;
		// Array to keep indexes of columns that requires change [ 2, 3, 6] Columns 2, 3 and 6 must be transformed
		this._affectedColumns = null;
		// Array to keep category values for _affectedColumns variable [ 'sor.name.fn1', 'sor.name.cat2', 'sor.name.cat5']
		// Column 2 must use function sor.name.fn1, column 3 must use function sor.name.cat2 and column 6 must use sor.name.cat5
		this._affectedColumnFn = null;
		// pgfilter file already parsed
		this._mapper = mapper;
		this._debug = debug;
		this._debug(`Starting on debug mode...`);
	}

	// /**
	//  * Analyze line with a COPY statement line. Return true if the line requires anonymization process
	//  * @param {string} line
	//  * @returns boolean True if the COPY statement requires anonymization otherwise false
	//  */
	// check(line) {
	// 	try {
	// 		const copyArrTkns = splitCopyStatement(line);// ['COPY', <relation>, <columns>, 'FROM', 'stdin;']
	// 		if (copyArrTkns) {
	//			this._setMappedRelation(copyArrTkns);
	// 			if (this._relation) {
	// 				// Store all the columns in an array
	// 				this._setColumnsFromLine(copyArrTkns);
	// 				// Store index position of columns that requires anon with the category from the mapper file
	// 				this._setAffectedColumns(); // Set this._affectedColumns + this._affectedColumnFn
	// 				if (this._debugMode) {
	// 					console.warn('[PG_RESTORE_FILTER] Relation for anonymization found:', this._relation);
	// 				}
	// 			}
	// 			return this._relation;
	// 		}
	// 	} catch (error) {
	// 		console.warn(`[PG_RESTORE_FILTER] Error analyzing line: ${line}`, error);
	// 		//Ignore anonymization if there is an exception
	// 		return false;
	// 	}
	// }

	// /**
	//  * Start anonymization process to the current line based on the previous COPY statement
	//  * @param {string} lineWithData
	//  */
	// anonymize(lineWithData) {
	// 	// Check if the metadata is loaded to apply the anonymization process otherwise return the same line
	// 	if (this._affectedColumns && this._affectedColumnFn) {
	// 		const columnsValues = lineWithData.split('\t');
	// 		if (this.hasFiltering) {
	// 			let excludeLine = null;
	// 			// This forEach must run only once
	// 			this._affectedColumns.forEach((indexv, i) => {
	// 				let [cat, factor, ...rest] = this._affectedColumnFn[i].split('-');
	// 				if (this._applyFiltering(cat, factor, columnsValues[indexv], parseInt(rest))) {
	// 					excludeLine = lineWithData;
	// 				} else {
	// 					excludeLine = null;
	// 				}
	// 			});
	// 			if (this._debugMode && excludeLine === null) {
	// 				console.warn(`[PG_RESTORE_FILTER] Ignoring line: ${lineWithData.substring(0, 15)}...`);
	// 			}
	// 			return excludeLine;
	// 		} else {
	// 			// Setting the seed before process the whole line
	// 			this.setRealSeed(this.seedType, columnsValues[this._seedTypeIndex], lineWithData, this._seedTypeIndex);
	// 			this._affectedColumns.forEach((indexv, i) => {
	// 				let [cat, factor, ...rest] = this._affectedColumnFn[i].split('-');
	// 				// TODO:
	// 				columnsValues[indexv] = this._applyAnon(
	// 					cat,
	// 					factor,
	// 					columnsValues[indexv],
	// 					parseInt(rest)
	// 				);
	// 			});
	// 			return columnsValues.join('\t');
	// 		}
	// 	} else {
	// 		return lineWithData;
	// 	}
	// }

	// /**
	//  * Start filtering process to the current line.
	//  * If the filtering function return true the complete line is ignored
	//  * @param {string} lineWithData
	//  * @deprecated
	//  */
	// filter(lineWithData) {
	// 	let excludeLine = null;
	// 	// Check if the metadata is loaded to apply the anonymization process otherwise return the same line
	// 	if (this._affectedColumns && this._affectedColumnFn) {
	// 		const columnsValues = lineWithData.split('\t');
	// 		// This forEach must run only once
	// 		this._affectedColumns.forEach((indexv, i) => {
	// 			let [cat, factor, ...rest] = this._affectedColumnFn[i].split('-');
	// 			if (this._applyFiltering(cat, factor, columnsValues[indexv], parseInt(rest))) {
	// 				excludeLine = lineWithData;
	// 			} else {
	// 				excludeLine = null;
	// 			}
	// 		});
	// 		return excludeLine;
	// 	} else {
	// 		return lineWithData;
	// 	}
	// }

	// /**
	//  * Apply the target mode
	//  * @param {string} lineWithData
	//  */
	// transform(lineWithData) {
	// 	// 	if (this._affectedColumns && this._affectedColumnFn) {
	// 		const columnsValues = lineWithData.split('\t');
	// 		if (this.hasFiltering) {
	// 			let excludeLine = null;
	// 			// This forEach must run only once
	// 			this._affectedColumns.forEach((indexv, i) => {
	// 				let [cat, factor, ...rest] = this._affectedColumnFn[i].split('-');
	// 				if (this._applyFiltering(cat, factor, columnsValues[indexv], parseInt(rest))) {
	// 					excludeLine = lineWithData;
	// 				} else {
	// 					excludeLine = null;
	// 				}
	// 			});
	// 			if (this._debugMode && excludeLine === null) {
	// 				console.warn(`[PG_RESTORE_FILTER] Ignoring line: ${lineWithData.substring(0, 15)}...`);
	// 			}
	// 			return excludeLine;
	// 		} else {
	// 			// Setting the seed before process the whole line
	// 			this.setRealSeed(this.seedType, columnsValues[this._seedTypeIndex], lineWithData, this._seedTypeIndex);
	// 			this._affectedColumns.forEach((indexv, i) => {
	// 				let [cat, factor, ...rest] = this._affectedColumnFn[i].split('-');
	// 				// TODO:
	// 				columnsValues[indexv] = this._applyAnon(
	// 					cat,
	// 					factor,
	// 					columnsValues[indexv],
	// 					parseInt(rest)
	// 				);
	// 			});
	// 			return columnsValues.join('\t');
	// 		}
	// 	} else {
	// 		return lineWithData;
	// 	}
	// }

	// /**
	//  * Clean metadata
	//  */
	// reset() {
	// 	this._relation = null;
	// 	this._columns = null;
	// 	this._affectedColumns = null;
	// 	this._affectedColumnFn = null;
	// 	this._hasAFilterFn = false;
	// }

	// /**
	//  * Apply the correct function for anonymization
	//  * @param {string} category
	//  * @param {number} factor
	//  * @param {string} val  Column current value
	//  */
	// _applyAnon(category, factor, val) {
	// 	try {
	// 		return DataM.applyDataAnonFn(category, this.realseed, factor, val);
	// 	} catch (error) {
	// 		console.warn('[PG_RESTORE_FILTER|ANONYMIZING]', error);
	// 		return val;
	// 	}
	// }

	// /**
	//  * Apply the correct function for filtering
	//  * @param {string} category
	//  * @param {number} factor
	//  * @param {string} val  Column current value
	//  */
	// _applyFiltering(category, factor, val) {
	// 	try {
	// 		const result = DataM.applyDataFilterFn(category, factor, val);
	// 		return result;
	// 	} catch (error) {
	// 		console.warn('[PG_RESTORE_FILTER|FILTERING]', error);
	// 		return val;
	// 	}
	// }

	/**
	 * Return the mapped relation based on the mapper
	 * @param {Array} tokens ['COPY', <relation>, <columns>, 'FROM', 'stdin;']
	 * @returns null|relation
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
	 * Store  affected columns by index and the column category by index
	 */
	_setAffectedColumns() {
		if (this._relation && this._columns) {
			if (this._mapper && this._mapper[this._relation]) {
				const transfColumns = this._mapper[this._relation];
				// Get the affected columns on the current COPY statement
				this._affectedColumns = Object.keys(transfColumns).map(c => this._columns.indexOf(c)).filter(c => c !== -1);
				// Get the filter category on the affected columns on the current COPY statement
				this._affectedColumnFn = this._affectedColumns.map((index) => {

					// Get category definition
					let fn = transfColumns[this._columns[index]];
					// Check if there is a filter function
					this._hasAFilterFn = this._hasAFilterFn || isAFilterFn(fn);
					return fn;
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

	get affectedColumns() {
		return this._affectedColumns;
	}

	get hasFiltering() {
		return this._hasAFilterFn;
	}

}

module.exports = Analyzer;
