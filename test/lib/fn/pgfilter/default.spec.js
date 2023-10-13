import t from 'tap'
import { zlen, zlar, nul } from '../../../../lib/fn/pgfilter/default.js'

t.test('pgfilter.default namespace function test suit', (t) => {
  t.plan(3)
  t.equal(zlen('test'), '')
  t.equal(zlar('test'), '{}')
  t.equal(nul('test'), '\\N')
})
