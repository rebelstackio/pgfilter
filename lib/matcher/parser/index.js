/* lib/anonymizer/index.js */
'use strict';

const { splitCopyStatement, hasFilterCategory } = require('../utils');
const DataM = require('./data');

/**
 * Inspect COPY statement that match import data pattern on postgres. Build several
 * internal data structures and variables to allow anonymization of the current data block
 */
class Parser {
	/**
	 * Constructor
	 * @param {object} mapper Object with all the relation that requires anonymize
	 */
	constructor(mapper, debugMode = false) {
		// Current relation name on analysis
		this._relation = null;
		// Current Columns for the relation on analysis
		this._columns = null;
		// Array to keep indexes of columns that requires change [ 2, 3, 6] Columns 2, 3 and 6 must change to anonymized value
		this._affectedColumns = null;
		// Array to keep category values for _affectedColumns variable [ 'cat1', 'cat2', 'cat5'] Column 2 has cat1, column 3 has cat2 and column 6 has cat5
		this._affectedColumnCategory = null;
		// Mapper object whith all the relation that requeries anonymization and what kind
		this._mapper = mapper;
		// Seed type to keep data related on anonymization process
		this._seedType = null;
		// Seed Type Index in the columns
		this._seedTypeIndex = null;
		//  Internal seed
		this._realseed = Math.round(Math.random() * 102400 + 1);
		// Print data integrity problems or seed relation issues
		this._debugMode = debugMode;
		// Flag that allows filtering data and avoid extra processing
		this._hasAFilterCategory = false;

		if (this._debugMode) {
			console.warn(`[PG_RESTORE_FILTER] Starting pg_restore_filter on debug mode...`);
		}
	}

	/**
	 * Get the correct "id" or seed based on the type. If the type does not match return the same value
	 * @param {string} seedtype SEED_TYPE
	 * @param {string} val value
	 */
	setRealSeed(seedtype, val, line, seedindex) {
		try {
			let rseed = DataM.getSeedByMapper(seedtype, val);
			if (typeof rseed === 'number' && !isNaN(rseed)) {
				this._realseed = rseed;
			} else {
				throw new Error(`Calculated seed is not a number. Seedtype: ${seedtype}, Table: ${this.relation}, Val: ${val}. Seed Index: ${seedindex}, Line: ${line}. Creating a random value...`);
			}
		} catch (error) {
			this._realseed = Math.round(Math.random() * 102400 + 1);
		}
	}

	/**
	 * Analyze line with a COPY statement line. Return true if the line requires anonymization process
	 * @param {string} line
	 * @returns boolean True if the COPY statement requires anonymization otherwise false
	 */
	analyzeLine(line) {
		try {
			const copyArrTkns = splitCopyStatement(line);// ['COPY', <relation>, <columns>, 'FROM', 'stdin;']
			if (copyArrTkns) {
				const relationFoundOnMapper = this._setRelationFromLine(copyArrTkns);
				if (relationFoundOnMapper) {
					// Store all the columns in an array
					this._setColumnsFromLine(copyArrTkns);
					// Store index position of columns that requires anon with the category from the mapper file
					this._setAffectedColumns(); // Set this._affectedColumns + this._affectedColumnCategory
					if (this._debugMode) {
						console.warn('[PG_RESTORE_FILTER] Relation for anonymization found:', this._relation);
					}
				}
				return relationFoundOnMapper;
			}
		} catch (error) {
			console.warn(`[PG_RESTORE_FILTER] Error analyzing line: ${line}`, error);
			//Ignore anonymization if there is an exception
			return false;
		}
	}

	/**
	 * Start anonymization process to the current line based on the previous COPY statement
	 * @param {string} lineWithData
	 */
	anonymize(lineWithData) {
		// Check if the metadata is loaded to apply the anonymization process otherwise return the same line
		if (this._affectedColumns && this._affectedColumnCategory) {
			const columnsValues = lineWithData.split('\t');
			if (this.hasFiltering) {
				let excludeLine = null;
				// This forEach must run only once
				this._affectedColumns.forEach((indexv, i) => {
					let [cat, factor, ...rest] = this._affectedColumnCategory[i].split('-');
					if (this._applyFiltering(cat, factor, columnsValues[indexv], parseInt(rest))) {
						excludeLine = lineWithData;
					} else {
						excludeLine = null;
					}
				});
				if (this._debugMode && excludeLine === null) {
					console.warn(`[PG_RESTORE_FILTER] Ignoring line: ${lineWithData.substring(0, 15)}...`);
				}
				return excludeLine;
			} else {
				// Setting the seed before process the whole line
				this.setRealSeed(this.seedType, columnsValues[this._seedTypeIndex], lineWithData, this._seedTypeIndex);
				this._affectedColumns.forEach((indexv, i) => {
					let [cat, factor, ...rest] = this._affectedColumnCategory[i].split('-');
					// TODO:
					columnsValues[indexv] = this._applyAnon(
						cat,
						factor,
						columnsValues[indexv],
						parseInt(rest)
					);
				});
				return columnsValues.join('\t');
			}
		} else {
			return lineWithData;
		}
	}

	/**
	 * Start filtering process to the current line.
	 * If the filtering function return true the complete line is ignored
	 * @param {string} lineWithData
	 * @deprecated
	 */
	filter(lineWithData) {
		let excludeLine = null;
		// Check if the metadata is loaded to apply the anonymization process otherwise return the same line
		if (this._affectedColumns && this._affectedColumnCategory) {
			const columnsValues = lineWithData.split('\t');
			// This forEach must run only once
			this._affectedColumns.forEach((indexv, i) => {
				let [cat, factor, ...rest] = this._affectedColumnCategory[i].split('-');
				if (this._applyFiltering(cat, factor, columnsValues[indexv], parseInt(rest))) {
					excludeLine = lineWithData;
				} else {
					excludeLine = null;
				}
			});
			return excludeLine;
		} else {
			return lineWithData;
		}
	}

	/**
	 * Apply the target mode
	 * @param {string} lineWithData
	 */
	apply(lineWithData) {
		return this.anonymize(lineWithData);
	}

	/**
	 * Clean metadata
	 */
	clean() {
		this._relation = null;
		this._columns = null;
		this._affectedColumns = null;
		this._affectedColumnCategory = null;
		this._seedType = null;
		this._seedTypeIndex = null;
		this._realseed = Math.round(Math.random() * 102400 + 1);
		this._hasAFilterCategory = false;
	}

	/**
	 * Apply the correct function for anonymization
	 * @param {string} category
	 * @param {number} factor
	 * @param {string} val  Column current value
	 */
	_applyAnon(category, factor, val) {
		try {
			return DataM.applyDataAnonFn(category, this.realseed, factor, val);
		} catch (error) {
			console.warn('[PG_RESTORE_FILTER|ANONYMIZING]', error);
			return val;
		}
	}

	/**
	 * Apply the correct function for filtering
	 * @param {string} category
	 * @param {number} factor
	 * @param {string} val  Column current value
	 */
	_applyFiltering(category, factor, val) {
		try {
			const result = DataM.applyDataFilterFn(category, factor, val);
			return result;
		} catch (error) {
			console.warn('[PG_RESTORE_FILTER|FILTERING]', error);
			return val;
		}
	}

	/**
	 * Store the relation
	 * @param {Array} tokens ['COPY', <relation>, <columns>, 'FROM', 'stdin;']
	 */
	_setRelationFromLine(tokens) {
		if (tokens) {
			if (this._mapper[tokens[1]]) {
				this._relation = tokens[1];
				return true;
			} else {
				this._relation = null;
				return false;
			}
		} else {
			this._relation = null;
			return false;
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
				const anonColumns = this._mapper[this._relation];
				// Get the affected columns by filters on the current COPY statement
				this._affectedColumns = Object.keys(anonColumns).map(c => this._columns.indexOf(c)).filter(c => c !== -1);
				// Get the filter category on the affected columns on the current COPY statement
				this._affectedColumnCategory = this._affectedColumns.map((index) => {
					// TODO: Multiple seed in the same table ??
					this._setSeedTypeAndIndex(anonColumns[this._columns[index]], index);
					// Get category definition
					let filterCat = anonColumns[this._columns[index]];
					// Check if there is a filter function
					this._hasAFilterCategory = this._hasAFilterCategory || hasFilterCategory(filterCat);
					return filterCat;
				});
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	/**
	 * Set the seed type
	 * @param {string} type Possible Seed Type
	 */
	_setSeedTypeAndIndex(type, index) {
		if (DataM.isSeedType(type)) {
			this._seedType = type;
			this._seedTypeIndex = index;
		}
	}

	get relation() {
		return this._relation;
	}

	get columns() {
		return this._columns;
	}

	get mapper() {
		return this._mapper;
	}

	get affectedColumns() {
		return this._affectedColumns;
	}

	get seedType() {
		return this._seedType;
	}

	get realseed() {
		return this._realseed;
	}

	get isDebug() {
		return this._debugMode;
	}

	get hasFiltering() {
		return this._hasAFilterCategory;
	}

}

module.exports = Parser;
