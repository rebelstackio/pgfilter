/* eslint-disable no-useless-escape */
/* eslint-disable no-tabs */
/* test/lib/utils.spec.js */

const tc = require('tap')

const {
  isStartOfCopyStatement,
  isEndOfCopyStatement,
  splitCopyStatement,
  isAFilterFn,
  validJSONFile,
  handleSysErrors,
  validBackupFile,
  validFile,
  validBuffer,
  inputFromSTDIN
} = require('../../lib/utils')

const rn = () => Math.random() * 1000

const dirname = tc.testdir({
  'test.json': JSON.stringify({ valid: true })
})

tc.test('isStartOfCopyStatement must return false if the line does not match the statement COPY <relation> (col1, col2, col3...coln) FROM stdin;', (t) => {
  t.plan(6)
  let line = 'ALTER FUNCTION public.insert_fatnlong(pcreated timestamp without time zone) OWNER TO postgres;'
  t.notOk(isStartOfCopyStatement(line))
  line = '-- Data for Name: acglheaderlink; Type: TABLE DATA; Schema: accounting; Owner: lyadmin'
  t.notOk(isStartOfCopyStatement(line))
  line = ''
  t.notOk(isStartOfCopyStatement(line))
  line = '               '
  t.notOk(isStartOfCopyStatement(line))
  line = '\.'
  t.notOk(isStartOfCopyStatement(line))
  line = '7	209	199	RANDOM_DATA	2015-03-16 09:10:21.807857'
  t.notOk(isStartOfCopyStatement(line))
})

tc.test('isStartOfCopyStatement must return true if the line matchs the statement COPY <relation> (col1, col2, col3...coln) FROM stdin;', (t) => {
  t.plan(5)
  let line = 'COPY public.fatnlong (id, created, updated, name, password) FROM stdin;'
  t.ok(isStartOfCopyStatement(line))
  line = 'COPY accounting.ac_modules (seq_ac_modules, description, created, createby, backuptype, backuplookback) FROM stdin;'
  t.ok(isStartOfCopyStatement(line))
  line = 'COPY accounting.acannual_1099e (seq, acannual_1099_seq_seq, payer_federalidnumber, recip_federalidnumber, modified, modifiedby) FROM stdin;'
  t.ok(isStartOfCopyStatement(line))
  line = 'COPY accounting.acape (seq, acap_seq, federalidnumber, routingnumber, bankaccountnumber, modified, modifiedby) FROM stdin;'
  t.ok(isStartOfCopyStatement(line))
  line = 'COPY accounting.acglheaderlink (seq, fromseq, toseq, mode, created) FROM stdin;'
  t.ok(isStartOfCopyStatement(line))
})

tc.test('isEndOfCopyStatement must return false if the line does not match the statement \.', (t) => {
  t.plan(7)
  let line = 'ALTER FUNCTION public.insert_fatnlong(pcreated timestamp without time zone) OWNER TO postgres;'
  t.notOk(isEndOfCopyStatement(line))
  line = '-- Data for Name: acglheaderlink; Type: TABLE DATA; Schema: accounting; Owner: lyadmin'
  t.notOk(isEndOfCopyStatement(line))
  line = ''
  t.notOk(isEndOfCopyStatement(line))
  line = '               '
  t.notOk(isEndOfCopyStatement(line))
  line = '7	209	199	RANDOM_DATA	2015-03-16 09:10:21.807857'
  t.notOk(isEndOfCopyStatement(line))
  line = 'COPY accounting.acannual_1099e (seq, acannual_1099_seq_seq, payer_federalidnumber, recip_federalidnumber, modified, modifiedby) FROM stdin;'
  t.notOk(isEndOfCopyStatement(line))
  line = 'SELECT pg_catalog.setval(\'service.slrocommprefs_seq_seq\', 1, false);'
  t.notOk(isEndOfCopyStatement(line))
})

tc.test('isEndOfCopyStatement must return true if the line matchs the statement \.', (t) => {
  t.plan(1)
  const line = '\\.'
  t.ok(isEndOfCopyStatement(line))
})

tc.test('splitCopyStatement must return an array with the COPY statement splitted like [COPY, <relation>, <columns>, FROM, stdin;]', (t) => {
  t.plan(8)
  let result = splitCopyStatement('COPY accounting.acglheaderlink (seq, fromseq, toseq, mode, created) FROM stdin;')

  t.equal(result.length, 5, 'array of size 5')
  t.equal(result[2], '(seq, fromseq, toseq, mode, created)')

  result = splitCopyStatement('COPY logging.cm (seq, column_name, old_value, new_value, modified_by, client_addr, query_id, date_modified, record_seq, schema_name, table_name, event) FROM stdin;')
  t.equal(result.length, 5, 'array of size 5')
  t.equal(result[2], '(seq, column_name, old_value, new_value, modified_by, client_addr, query_id, date_modified, record_seq, schema_name, table_name, event)')

  result = splitCopyStatement('COPY public.mn_note (seq, id) FROM stdin;')
  t.equal(result.length, 5, 'array of size 5')
  t.equal(result[2], '(seq, id)')

  result = splitCopyStatement('COPY public.mn_note (seq) FROM stdin;')
  t.equal(result.length, 5, 'array of size 5')
  t.equal(result[2], '(seq)')
})

tc.test('isAFilterFn must return false if the fn label does not follow the standar <source>.<namespace>.<fnname>', (t) => {
  t.plan(2)
  t.notOk(isAFilterFn('random_srtring'))
  t.notOk(isAFilterFn('fake.test'))
})

tc.test('isAFilterFn must return false if the fn source is different to pgfilter', (t) => {
  t.plan(1)
  t.notOk(isAFilterFn('faker.filter.num'))
})

tc.test('isAFilterFn must return false if the fn namespace is different to filter', (t) => {
  t.plan(1)
  t.notOk(isAFilterFn('pgfilter.random.num'))
})

tc.test('isAFilterFn must return true if the fn namespace is equal filter and the source to pgfilter', (t) => {
  t.plan(1)
  t.ok(isAFilterFn('pgfilter.filter.fnow'))
})

tc.test('handleSysErrors must always return an Error instance', (t) => {
  t.plan(1)
  const err = new Error('custom err')
  t.ok(handleSysErrors(err, 'arg1') instanceof Error)
})

tc.test('handleSysErrors must change the error message if the original error code is EONET', (t) => {
  t.plan(2)
  const err = new Error('custom err')
  err.code = 'ENOENT'

  const nerr = handleSysErrors(err, 'arg1')
  t.ok(nerr instanceof Error)
  t.match(nerr.message, /'arg1' must be a valid file path/)
})

tc.test('handleSysErrors must change the error message if the original error code is EACCES', (t) => {
  t.plan(2)
  const err = new Error('custom err')
  err.code = 'EACCES'

  const nerr = handleSysErrors(err, 'arg1')
  t.ok(nerr instanceof Error)
  t.match(nerr.message, /'arg1' needs read permissions/)
})

tc.test('handleSysErrors must change the error message if the original error is instance of SyntaxError', (t) => {
  t.plan(2)
  const err = new SyntaxError('json parsing error')
  const nerr = handleSysErrors(err, 'arg1')
  t.ok(nerr instanceof SyntaxError)
  t.match(nerr.message, /'arg1' must be a valid JSON document/)
})

tc.test('handleSysErrors must use the original error message if it is a no-handle error', (t) => {
  t.plan(2)
  const err = new Error('custom err')
  const nerr = handleSysErrors(err, 'arg1')
  t.ok(nerr instanceof Error)
  t.match(nerr.message, /custom err/)
})

tc.test('validJSONFile must throw an error if the file does not exists', (t) => {
  t.plan(1)
  t.throws(() => {
    validJSONFile(`/tmp/test${rn()}.json`)
  })
})

tc.test('validJSONFile must throw an error if the file is not a valid JSON file', (t) => {
  t.plan(1)
  const dirname = t.testdir({
    'fake.json': 'contents'
  })
  t.throws(() => {
    validJSONFile(`${dirname}/fake.json`)
  })
})

tc.test('validJSONFile must throw an error if the file is not a valid JSON file', (t) => {
  t.plan(1)
  t.doesNotThrow(() => {
    validJSONFile(`${dirname}/test.json`)
  })
})

tc.test('validFile must throw an error if the file does not exists', (t) => {
  t.plan(1)
  t.throws(() => {
    validFile(`/tmp/dump${rn()}.dump`)
  })
})

tc.test('validFile must throw an error if the file does not exists', { saveFixture: false }, (tt) => {
  tt.plan(1)
  const dirname = tt.testdir({
    'dump.dump': 'contents'
  })
  tt.doesNotThrow(() => {
    validFile(`${dirname}/dump.dump`)
  })
})

tc.test('validBackupFile must throw an error if the file does not exists', (t) => {
  t.plan(1)
  t.throws(() => {
    validBackupFile(`/tmp/dump${rn()}.dump`)
  })
})

tc.test('validBackupFile must not throw an error if the file is null( STDIN ) and return null', (t) => {
  t.plan(1)
  t.equal(validBackupFile(null), null)
})

tc.test('validBuffer must throw an error if the buffer is NaN', (t) => {
  t.plan(1)
  t.throws(() => {
    validBuffer('NaN')
  })
})

tc.test('validBuffer must return the buffer if it is valid', (t) => {
  t.plan(1)
  t.equal(validBuffer(30), 30)
})

tc.test('validBuffer must round the buffer if it is a fractional number', (t) => {
  t.plan(2)
  t.equal(validBuffer(30.1), 30)
  t.equal(validBuffer(30.9), 31)
})

tc.test('inputFromSTDIN must return true if the \'backup_file\' property is not present in the yargs parsed object', (t) => {
  t.plan(1)
  const yargsCLIOptsParsed = {
    b: 0,
    'buffer-length': 0,
    bufferLength: 0,
    s: false,
    'skip-overflow': false,
    skipOverflow: false
  }

  t.ok(inputFromSTDIN(yargsCLIOptsParsed))
})

tc.test('inputFromSTDIN must return true if the \'backup_file\' property is null', (t) => {
  t.plan(1)
  const yargsCLIOptsParsed = {
    b: 0,
    'buffer-length': 0,
    bufferLength: 0,
    s: false,
    'skip-overflow': false,
    skipOverflow: false,
    backup_file: null
  }

  t.ok(inputFromSTDIN(yargsCLIOptsParsed))
})

tc.test('inputFromSTDIN must return false if the \'backup_file\' property is as valid file path', (t) => {
  t.plan(1)
  const yargsCLIOptsParsed = {
    b: 0,
    'buffer-length': 0,
    bufferLength: 0,
    s: false,
    'skip-overflow': false,
    skipOverflow: false,
    backup_file: '/backups/my_backup.dump'
  }

  t.notOk(inputFromSTDIN(yargsCLIOptsParsed))
  t.end()
})
