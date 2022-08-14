/* lib/splitter */

const split2 = require('split2')

const splitter = function splitter (matcher = null, mapper = null, options = {}) {
  return split2(matcher, mapper, options)
}

module.exports = splitter
