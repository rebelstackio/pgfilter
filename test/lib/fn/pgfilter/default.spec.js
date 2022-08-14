/* test/lib/fn/pgfilter/default.spec.js */
'use strict'

const t = require('tap')
const test = t.test

const { zlen, zlar, nul } = require('../../../../lib/fn/pgfilter/default')

test('pgfilter.default namespace function test suit', (t) => {
  t.plan(3)
  t.equal(zlen('test'), '')
  t.equal(zlar('test'), '{}')
  t.equal(nul('test'), '\\N')
})
