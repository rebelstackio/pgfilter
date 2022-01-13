/* lib/matcher/index.js */

const { Transform } = require('stream');

const { isStartOfCopyStatement, isEndOfCopyStatement } = require('../utils');

const matcher = function _matcher(analyzer, { readableHighWaterMark = null, writableHighWaterMark = null }) {
	const CopyTransform = new Transform({
		readableHighWaterMark,
		writableHighWaterMark,
		transform(chunk, _encoding, done) {
			let nline = chunk.toString();
			if (this._copyStatementFound && !isEndOfCopyStatement(nline)) {
				nline = analyzer.transform(nline);
			}

			if (nline !== null && isStartOfCopyStatement(nline)) {
				this._copyStatementFound = analyzer.check(nline);
				if (this._copyStatementFound && analyzer.onVerboseMode) {
					console.warn('[pgfilter]', `Copy found`, this._copyStatementFound, nline);
				}
			}

			if (nline !== null && isEndOfCopyStatement(nline)) {
				this._copyStatementFound = false;
				analyzer.reset();
			}

			// Add transformed line to the stream and add the newline removed by the splitter
			if (nline !== null) {
				this.push(Buffer.from(nline + '\n'));
			}

			return void done();
		},
	});
	return CopyTransform;
};

module.exports = matcher;
