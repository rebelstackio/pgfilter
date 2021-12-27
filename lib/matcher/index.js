/* lib/transform/index.js */

const { Transform } = require('stream');

const { isStartOfCopyStatement, isEndOfCopyStatement } = require('./utils');

/**
 * Stream transformer that replace data based on mapper object for anonymazation
 * @param {object} anonymMapper Anon Object
 * @param {number} readableHighWaterMark If null the default value is 65536
 * @param {number} writableHighWaterMark If null the default value is 16384
 */
const getCopyTransform = function _getCopyTransform(parser, readableHighWaterMark = null, writableHighWaterMark = null) {
	const CopyTransform = new Transform({
		readableHighWaterMark,
		writableHighWaterMark,
		transform(chunk, _encoding, done) {
			let nline = chunk.toString();
			if ( this._copyStatementFound && !isEndOfCopyStatement(nline) ) {
				nline = parser.apply(nline);
			}

			if ( nline !== null && isStartOfCopyStatement(nline) ) {
				this._copyStatementFound = parser.analyzeLine(nline);
				if ( parser.isDebug ) {
					console.warn(`[PG_RESTORE_FILTER] Copy found`,this._copyStatementFound, nline);
				}
			}

			if ( nline !== null && isEndOfCopyStatement(nline) ) {
				this._copyStatementFound  = false;
				parser.clean();
			}

			// Add transformed line to the stream and add the newline removed by the splitterTransform
			if ( nline !== null ) {
				this.push(Buffer.from(nline+'\n'));
			}

			return void done();
		},
	});
	return CopyTransform;
};

module.exports = getCopyTransform;
