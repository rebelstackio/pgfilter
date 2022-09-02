/* eslint-disable no-tabs */
/* test/lib/analyzer/index.spec.js */

const MockDate = require('mockdate')
const t = require('tap')

const Analyzer = require('../../../lib/analyzer')
const { splitCopyStatement } = require('../../../lib/utils')

const PGFILTER_PARSED_FILE = {
  'public.actor': {
    first_name: 'faker.name.firstName',
    last_name: 'faker.name.lastName'
  },
  'public.address': {
    address: 'faker.address.streetName',
    address2: 'faker.address.streetName',
    phone: 'faker.phone.phoneNumber'
  },
  'public.city': {
    city: 'faker.address.city'
  },
  'public.country': {
    country: 'faker.address.country'
  },
  'public.customer': {
    first_name: 'faker.name.firstName',
    last_name: 'faker.name.lastName',
    email: 'faker.internet.email'
  },
  'public.amount': {
    amount: 'faker.datatype.number'
  },
  'public.history': {
    ip: 'faker.internet.ip',
    cdate: 'pgfilter.filter.fnow-P30D'
  }
}

const verboseMode = false
const loggerSpy = () => {}

t.test('_setMappedRelation must set null if the statement from the backup file is not related to importing data(COPY)', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  const line = 'SELECT random.function_cal(1, 2, 3)'
  an._setMappedRelation(splitCopyStatement(line))
  tt.equal(an.relation, null)
})

t.test('_setMappedRelation must set the relation/table if the table/relation is present in the pgfilter file', (tt) => {
  tt.plan(2)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  let line = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;'
  an._setMappedRelation(splitCopyStatement(line))
  tt.equal(an.relation, 'public.actor')

  line = 'COPY public.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) FROM stdin;'
  an._setMappedRelation(splitCopyStatement(line))
  tt.equal(an.relation, 'public.address')
})

t.test('_setMappedRelation must set null if the table/relation is not present in the pgfilter file', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  const line = 'COPY public.category (category_id, name, last_update) FROM stdin;'
  an._setMappedRelation(splitCopyStatement(line))
  tt.equal(an.relation, null)
})

t.test('_setColumnsFromLine must set the columns in the variable _columns from the COPY FROM statement line as an array to use the index for fast location', (tt) => {
  tt.plan(21)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  let line = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;'
  an._setColumnsFromLine(splitCopyStatement(line))
  tt.ok(Array.isArray(an.columns))
  tt.equal(an.columns.length, 4)
  tt.equal(an.columns[0], 'actor_id')
  tt.equal(an.columns[1], 'first_name')
  tt.equal(an.columns[2], 'last_name')
  tt.equal(an.columns[3], 'last_update')

  line = 'COPY public.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) FROM stdin;'
  an._setColumnsFromLine(splitCopyStatement(line))
  tt.ok(Array.isArray(an.columns))
  tt.equal(an.columns.length, 8)
  tt.equal(an.columns[0], 'address_id')
  tt.equal(an.columns[1], 'address')
  tt.equal(an.columns[2], 'address2')
  tt.equal(an.columns[3], 'district')
  tt.equal(an.columns[4], 'city_id')
  tt.equal(an.columns[5], 'postal_code')
  tt.equal(an.columns[6], 'phone')
  tt.equal(an.columns[7], 'last_update')

  line = 'COPY public.country (country_id, country, last_update) FROM stdin;'
  an._setColumnsFromLine(splitCopyStatement(line))
  tt.ok(Array.isArray(an.columns))
  tt.equal(an.columns.length, 3)
  tt.equal(an.columns[0], 'country_id')
  tt.equal(an.columns[1], 'country')
  tt.equal(an.columns[2], 'last_update')
})

t.test('_setColumnsFromLine must return null if the tokens are invalid', (tt) => {
  tt.plan(4)

  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  let res = an._setColumnsFromLine(null)
  tt.notOk(res)

  res = an._setColumnsFromLine(undefined)
  tt.notOk(res)

  res = an._setColumnsFromLine(false)
  tt.notOk(res)

  res = an._setColumnsFromLine('')
  tt.notOk(res)
})

t.test('_setMappedRelation must return null if the tokens are invalid', (tt) => {
  tt.plan(4)

  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  let res = an._setMappedRelation(null)
  tt.notOk(res)

  res = an._setMappedRelation(undefined)
  tt.notOk(res)

  res = an._setMappedRelation(false)
  tt.notOk(res)

  res = an._setMappedRelation('')
  tt.notOk(res)
})

t.test('_setAffectedColumns must return null if the relation is not present or valid', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const line = 'COPY public.pet (pet_id, first_name, last_update) FROM stdin;'
  an._setMappedRelation(splitCopyStatement(line))
  an._setColumnsFromLine(splitCopyStatement(line))
  const res = an._setAffectedColumns()

  tt.notOk(res)
})

t.test('_setAffectedColumns must set affectedTransColnsIdx as empty if the _columns and _relation are nulls', (tt) => {
  tt.plan(2)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const line = 'CREATE FUNCTION TEST...'
  an._setMappedRelation(splitCopyStatement(line))
  an._setColumnsFromLine(splitCopyStatement(line))
  an._setAffectedColumns()

  tt.ok(Array.isArray(an.affectedTransColnsIdx))
  tt.equal(an.affectedTransColnsIdx.length, 0)
})

t.test('_setAffectedColumns must set an array with the index positions of the columns that requires transformation', (tt) => {
  tt.plan(9)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  let line = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;'
  const tkns = splitCopyStatement(line)
  an._setMappedRelation(tkns)
  an._setColumnsFromLine(tkns)
  an._setAffectedColumns()

  tt.ok(Array.isArray(an.affectedTransColnsIdx))
  tt.equal(an.affectedTransColnsIdx.length, 2)
  tt.equal(an.affectedTransColnsIdx[0], 1) // first_name
  tt.equal(an.affectedTransColnsIdx[1], 2) // last_name

  an.reset() // Clean up internal metadata

  line = 'COPY public.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) FROM stdin;'
  an._setMappedRelation(splitCopyStatement(line))
  an._setColumnsFromLine(splitCopyStatement(line))
  an._setAffectedColumns()
  tt.ok(Array.isArray(an.affectedTransColnsIdx))
  tt.equal(an.affectedTransColnsIdx.length, 3)
  tt.equal(an.affectedTransColnsIdx[0], 1) // address
  tt.equal(an.affectedTransColnsIdx[1], 2) // address2
  tt.equal(an.affectedTransColnsIdx[2], 6) // phone
})

t.test('_setAffectedColumns must set an array of function labels for transformation with the same size of affectedTransColnsIdx and the respective function to use', (tt) => {
  tt.plan(4)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  const line = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;'
  const tkns = splitCopyStatement(line)
  an._setMappedRelation(tkns)
  an._setColumnsFromLine(tkns)
  an._setAffectedColumns()

  tt.ok(Array.isArray(an.affectedTransColnsFn))
  tt.equal(an.affectedTransColnsFn.length, 2)
  tt.equal(an.affectedTransColnsFn[0], 'faker.name.firstName') // first_name
  tt.equal(an.affectedTransColnsFn[1], 'faker.name.lastName') // last_name
})

t.test('_setAffectedColumns must set an array with the index positions of the columns that requires filtering and transformation', (tt) => {
  tt.plan(12)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  const line = 'COPY public.history (history_id, actor_id, action, ip, cdate) FROM stdin;'
  const tkns = splitCopyStatement(line)
  an._setMappedRelation(tkns)
  an._setColumnsFromLine(tkns)
  an._setAffectedColumns()

  tt.ok(Array.isArray(an.affectedFiltrColnsFn))
  tt.ok(Array.isArray(an.affectedFiltrColnsIdx))
  tt.equal(an.affectedFiltrColnsFn.length, 1)
  tt.equal(an.affectedFiltrColnsIdx.length, 1)

  tt.equal(an.affectedFiltrColnsIdx[0], 4) // cdate
  tt.equal(an.affectedFiltrColnsFn[0], 'pgfilter.filter.fnow-P30D')
  tt.ok(Array.isArray(an.affectedTransColnsIdx))
  tt.ok(Array.isArray(an._affectedFiltrColnsFn))
  tt.equal(an.affectedFiltrColnsFn.length, 1)
  tt.equal(an.affectedFiltrColnsIdx.length, 1)
  tt.equal(an.affectedTransColnsIdx[0], 3) // ip
  tt.equal(an.affectedTransColnsFn[0], 'faker.internet.ip')
})

t.test('check method must return null if the relation is not mapped in the pgfilter file', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  const line = 'COPY public.random (random_id, random_col1, random_col2) FROM stdin;'
  const rel = an.check(line)
  tt.equal(rel, null)
})

t.test('check method must return the table name if the relation is mapped in the pgfilter file', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  const line = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;'
  const rel = an.check(line)
  tt.equal(rel, 'public.actor')
})

t.test('check method must call console.warn on verbose mode', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, true, loggerSpy)

  const line = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;'
  const rel = an.check(line)
  tt.equal(rel, 'public.actor')
})

t.test('_applyFn must return the val argument if the function label is not valid', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  tt.equal((an._applyFn('test.default.name', 'John')), 'John')
})

t.test('_applyFn must change the val argument if the function label is valid', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)

  tt.not(an._applyFn('faker.name.firstName', 'John'), 'John')
})

t.test('_applyFn must call the function with all the arguments involved', (tt) => {
  tt.plan(8)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const colVal = 'mytest'
  const res = an._applyFn('pgfilter.filter.ftest-1-2-3', colVal)
  tt.hasProp(res, 'val')
  tt.hasProp(res, 'arg1')
  tt.hasProp(res, 'arg2')
  tt.hasProp(res, 'arg3')
  tt.equal(res.val, colVal)
  tt.equal(res.arg1, 1)
  tt.equal(res.arg2, 2)
  tt.equal(res.arg3, 3)
})

t.test('_transform must return a differnt line for a mapped relation on the pgfilter file', (tt) => {
  tt.plan(2)
  let rline, dline
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const cline = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;'
  an.check(cline)

  dline = '1	Penelope	Guiness	2013-05-26 14:47:57.62'
  rline = an._transform(dline.split('\t'))
  tt.not(rline, dline)

  dline = '4	Jennifer	Davis	2013-05-26 14:47:57.62'
  rline = an._transform(dline.split('\t'))
  tt.not(rline, dline)
})

t.test('_filter must return false if the filterning function does not match the condition', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const cline = 'COPY public.history (history_id, actor_id, action, ip, cdate) FROM stdin;'
  an.check(cline)

  MockDate.set('2022-01-18')

  const dline = '1	1	ADD	192.168.1.1	2022-01-17 14:47:57.62'
  const rline = an._filter(dline.split('\t'))
  tt.notOk(rline)
})

t.test('_filter must return true if the filterning function match the condition and the line should be excluded', (tt) => {
  tt.plan(2)
  let rline, dline
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const cline = 'COPY public.history (history_id, actor_id, action, ip, cdate) FROM stdin;'
  an.check(cline)

  MockDate.set('2022-01-18')

  dline = '1	1	ADD	192.168.1.1	2021-01-17 14:47:57.62'
  rline = an._filter(dline.split('\t'))
  tt.ok(rline)

  dline = '1	1	ADD	192.168.1.1	2000-01-17 16:55:22.62'
  rline = an._filter(dline.split('\t'))
  tt.ok(rline)
})

t.test('apply must transform the mapped column on the pgfilter file', (tt) => {
  tt.plan(2)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const line = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;'
  an.check(line)

  const dline = '1	Penelope	Guiness	2013-05-26 14:47:57.62'
  const rline = an.apply(dline)
  tt.not(rline, null)
  tt.not(rline, dline)
})

t.test('apply must filter the mapped column on the pgfilter file', (tt) => {
  tt.plan(1)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const line = 'COPY public.history (history_id, actor_id, action, ip, cdate) FROM stdin;'
  an.check(line)

  const dline = '1	1	ADD	192.168.1.1	2000-01-17 16:55:22.62'
  const rline = an.apply(dline)
  tt.equal(rline, null)
})

t.test('apply must filter & transform the mapped column on the pgfilter file', (tt) => {
  tt.plan(2)
  const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode, loggerSpy)
  const line = 'COPY public.history (history_id, actor_id, action, ip, cdate) FROM stdin;'
  an.check(line)
  MockDate.set('2022-01-18')

  const dline = '1	1	ADD	192.168.1.1	2022-01-17 14:47:57.62'
  const rline = an.apply(dline)
  tt.not(rline, null)
  tt.not(rline, dline)
})

t.test('onVerboseMode return the current verbose mode', (tt) => {
  tt.plan(5)
  let an = new Analyzer(PGFILTER_PARSED_FILE, false)
  tt.notOk(an.onVerboseMode)
  an = new Analyzer(PGFILTER_PARSED_FILE)
  tt.notOk(an.onVerboseMode)
  an = new Analyzer(PGFILTER_PARSED_FILE, true, loggerSpy)
  tt.ok(an.onVerboseMode)
  an = new Analyzer(PGFILTER_PARSED_FILE, null, loggerSpy)
  tt.notOk(an.onVerboseMode)
  an = new Analyzer(PGFILTER_PARSED_FILE, true, null)
  tt.ok(an.onVerboseMode)
})
