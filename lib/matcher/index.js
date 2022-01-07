/* lib/matcher/index.js */

const { Transform } = require('stream');

const { isStartOfCopyStatement, isEndOfCopyStatement } = require('./utils');

const matcher = function _matcher(analyzer, { readableHighWaterMark = null, writableHighWaterMark = null, debug }) {
	const CopyTransform = new Transform({
		readableHighWaterMark,
		writableHighWaterMark,
		transform(chunk, _encoding, done) {
			let nline = chunk.toString();
			if (this._copyStatementFound && !isEndOfCopyStatement(nline)) {
				nline = analyzer.apply(nline);
			}

			if (nline !== null && isStartOfCopyStatement(nline)) {
				this._copyStatementFound = analyzer.analyzeLine(nline);
				debug(`Copy found`, this._copyStatementFound, nline);
			}

			if (nline !== null && isEndOfCopyStatement(nline)) {
				this._copyStatementFound = false;
				analyzer.clean();
			}

			// Add transformed line to the stream and add the newline removed by the splitterTransform
			if (nline !== null) {
				this.push(Buffer.from(nline + '\n'));
			}

			return void done();
		},
	});
	return CopyTransform;
};

module.exports = matcher;
