/* test/lib/fn/pgfilter/default.spec.js */
'use strict'

const MockDate = require('mockdate')
const t = require('tap')
const test = t.test

const { fnow, ftest } = require('../../../../lib/fn/pgfilter/filter')

test('pgfilter.filter namespace function test suit', (tc) => {
  tc.plan(7)
  tc.test('fnow must throw an exception if the range argument is not valid', (t) => {
    t.plan(4)
    let rangeF = null
    const column = '2020-11-09T18:41:14.419Z'

    t.throws(() => {
      fnow(column, rangeF)
    })

    rangeF = undefined
    t.throws(() => {
      fnow(column, rangeF)
    })

    rangeF = true
    t.throws(() => {
      fnow(column, rangeF)
    })

    rangeF = 9099
    t.throws(() => {
      fnow(column, rangeF)
    })
  })

  tc.test('fnow must return false on P30D of 2020-11-09T18:41:14.419Z', (t) => {
    t.plan(1)
    const rangeF = 'P30D'
    const column = '2020-11-09T18:41:14.419Z'

    MockDate.set('2020-11-09')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  tc.test('fnow must return true on P30D of 2010-11-09T18:41:14.419Z', (t) => {
    t.plan(1)
    const rangeF = 'P30D'
    const column = '2010-11-09T18:41:14.419Z'

    MockDate.set('2020-11-09')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow must return true on P2D of 2020-11-05T18:41:14.419Z', (t) => {
    t.plan(1)
    const rangeF = 'P2D'
    const column = '2020-11-05 14:22:48.672979-06'

    MockDate.set('2020-11-09')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow should be exact on the compares', (t) => {
    t.plan(2)
    const rangeF = 'P1D'
    const column = '2020-11-07T18:41:14.419Z'

    let result
    MockDate.set('2020-11-08T18:41:14.419Z')
    result = fnow(column, rangeF)

    t.equal(result, false)

    MockDate.set('2020-11-08T18:42:14.419Z')
    result = fnow(column, rangeF)
    t.ok(result)
  })

  tc.test('fnow must return true on P20D of 2017-11-29T09:45:10.000Z', (t) => {
    t.plan(1)
    const rangeF = 'P20D'
    const column = '2017-11-29T09:45:10.000Z'

    MockDate.set('2020-11-09T20:13:47.949Z')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow must return true on P1Y of 2008-11-29T09:25:20.000Z', (t) => {
    t.plan(1)
    const rangeF = 'P1Y'
    const column = '2015-03-03 13:57:54.856896'

    MockDate.set('2021-01-13T17:12:46.980Z')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  test('fnow must return false on P1Y of 2020-11-29T09:25:20.000Z', (t) => {
    t.plan(1)
    const rangeF = 'P1Y'
    const column = '2020-11-29T09:25:20.000Z'

    MockDate.set('2021-01-13T17:12:46.980Z')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  test('fnow must return false on P1Y on a recent date', (t) => {
    t.plan(1)
    const rangeF = 'P1Y'
    const column = '2021-01-01T17:13:46.980Z'

    MockDate.set('2021-01-01T17:12:46.980Z')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  test('ftest must return and object with arguments', (t) => {
    t.plan(4)

    const result = ftest(1, '1', '2', '3')

    t.hasProp(result, 'val')
    t.hasProp(result, 'arg1')
    t.hasProp(result, 'arg2')
    t.hasProp(result, 'arg3')
  })
})
