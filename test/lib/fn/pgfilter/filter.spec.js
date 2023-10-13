import MockDate from 'mockdate'
import t from 'tap'
import { fnow, ftest } from '../../../../lib/fn/pgfilter/filter.js'

const test = t.test

test('pgfilter.filter namespace function test suit', (tc) => {
  tc.plan(18)
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

  tc.test('fnow must return false if the date pass the range ( 30 days/P30D of 2020-11-09T18:41:14.419Z )', (t) => {
    t.plan(1)
    const rangeF = 'P30D'
    const column = '2020-11-09T18:41:14.419Z'

    MockDate.set('2020-11-09')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  tc.test('fnow must return true if the date does not pass the range ( 30 days/P30D of 2010-11-09T18:41:14.419Z )', (t) => {
    t.plan(1)
    const rangeF = 'P30D'
    const column = '2010-11-09T18:41:14.419Z'

    MockDate.set('2020-11-09')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow must return true if the date does not pass the range ( 2 days/P2D of 2020-11-05T18:41:14.419Z )', (t) => {
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

    t.notOk(result)

    MockDate.set('2020-11-08T18:42:14.419Z')
    result = fnow(column, rangeF)
    t.ok(result)
  })

  tc.test('fnow must return true if the date does not pass the range( 20 days/P20D of 2017-11-29T09:45:10.000Z)', (t) => {
    t.plan(1)
    const rangeF = 'P20D'
    const column = '2017-11-29T09:45:10.000Z'

    MockDate.set('2020-11-09T20:13:47.949Z')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow must return true if the date does not pass the range( 1 year/P1Y of 2015-03-03 13:57:54.856896 )', (t) => {
    t.plan(1)
    const rangeF = 'P1Y'
    const column = '2015-03-03 13:57:54.856896'

    MockDate.set('2021-01-13T17:12:46.980Z')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow must return false if the date pass the range ( 1 year/P1Y of 2020-11-29T09:25:20.000Z )', (t) => {
    t.plan(1)
    const rangeF = 'P1Y'
    const column = '2020-11-29T09:25:20.000Z'

    MockDate.set('2021-01-13T17:12:46.980Z')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  tc.test('fnow must return false if the date pass the range ( 1 year/P1Y on a recent date)', (t) => {
    t.plan(1)
    const rangeF = 'P1Y'
    const column = '2021-01-01T17:13:46.980Z'

    MockDate.set('2021-01-01T17:12:46.980Z')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  tc.test('fnow must return true if the date does not pass the range in hours( 1 month/P1M on 2021-03-01T17:12:46.980Z)', (t) => {
    t.plan(1)
    const rangeF = 'P1M'
    const column = '2021-01-01T17:13:46.980Z'

    MockDate.set('2021-03-01T17:12:46.980Z')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow must return false if the date pass the range( 1minute/PT1M on 2021-03-01T17:52:46.980Z)', (t) => {
    t.plan(1)
    const rangeF = 'PT1M'
    const column = '2021-03-01T17:52:46.980Z'

    MockDate.set('2021-03-01T17:53:46.980Z')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  tc.test('fnow must return false if the date pass the range( 5minutes/PT5M on 2021-03-01T18:52:46.980Z)', (t) => {
    t.plan(1)
    const rangeF = 'PT5M'
    const column = '2021-03-01T18:49:46.980Z'

    MockDate.set('2021-03-01T18:52:46.980Z')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  tc.test('fnow must return true if the date does not pass the range( 5minutes/PT5M on 2021-03-01T18:52:46.980Z)', (t) => {
    t.plan(1)
    const rangeF = 'PT5M'
    const column = '2021-03-01T18:45:46.980Z'

    MockDate.set('2021-03-01T18:52:46.980Z')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow must return false if the date pass the range( 1hour/PT1H on 2021-03-01T17:52:46.980Z)', (t) => {
    t.plan(1)
    const rangeF = 'PT1H'
    const column = '2021-03-01T16:52:46.980Z'

    MockDate.set('2021-03-01T17:52:46.980Z')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  tc.test('fnow must return true if the date does not pass the range( 1hour/PT1H on 2021-03-01T17:52:46.980Z)', (t) => {
    t.plan(1)
    const rangeF = 'PT1H'
    const column = '2021-03-01T15:52:46.980Z'

    MockDate.set('2021-03-01T17:52:46.980Z')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('fnow must return false if the date pass the range( 5second/PT5S on 2021-03-01T17:52:46.980Z)', (t) => {
    t.plan(1)
    const rangeF = 'PT5S'
    const column = '2021-03-01T17:52:43.980Z'

    MockDate.set('2021-03-01T17:52:46.980Z')
    const result = fnow(column, rangeF)

    t.notOk(result)
  })

  tc.test('fnow must return true if the date does not pass the range( 5second/PT5S on 2021-03-01T17:52:46.980Z)', (t) => {
    t.plan(1)
    const rangeF = 'PT5S'
    const column = '2021-03-01T17:52:10.980Z'

    MockDate.set('2021-03-01T17:52:46.980Z')
    const result = fnow(column, rangeF)

    t.ok(result)
  })

  tc.test('ftest must return and object with arguments', (t) => {
    t.plan(4)

    const result = ftest(1, '1', '2', '3')

    t.hasProp(result, 'val')
    t.hasProp(result, 'arg1')
    t.hasProp(result, 'arg2')
    t.hasProp(result, 'arg3')
  })
})
