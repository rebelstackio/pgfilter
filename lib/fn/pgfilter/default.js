/* lib/fn/pgfilter/default.js */
'use strict'

const zlen = function _zlen () {
  return ''
}

const zlar = function _zlar () {
  return '{}'
}

const nul = function _nul () {
  return '\\N'
}

module.exports = {
  zlen,
  zlar,
  nul
}
