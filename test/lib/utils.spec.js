/* test/lib/utils.spec.js */

const {
	isStartOfCopyStatement,
	isEndOfCopyStatement,
	splitCopyStatement,
	isAFilterFn,
	validJSONFile,
	handleSysErrors,
	validBackupFile,
	validBuffer,
	inputFromSTDIN
} = require('../../lib/utils');

const rn = () => Math.random() * 1000

describe('Utils Functions TestSuit', () => {

	describe('isStartOfCopyStatement', () => {

		test('isStartOfCopyStatement must return false if the line does not match the statement COPY <relation> (col1, col2, col3...coln) FROM stdin;', () => {
			let line = `ALTER FUNCTION public.insert_fatnlong(pcreated timestamp without time zone) OWNER TO postgres;`
			expect(isStartOfCopyStatement(line)).toBe(false);
			line = `-- Data for Name: acglheaderlink; Type: TABLE DATA; Schema: accounting; Owner: lyadmin`
			expect(isStartOfCopyStatement(line)).toBe(false);
			line = ``
			expect(isStartOfCopyStatement(line)).toBe(false);
			line = `               `;
			expect(isStartOfCopyStatement(line)).toBe(false);
			line = `\.`;
			expect(isStartOfCopyStatement(line)).toBe(false);
			line = `7	209	199	RANDOM_DATA	2015-03-16 09:10:21.807857`;
			expect(isStartOfCopyStatement(line)).toBe(false);
		});

		test('isStartOfCopyStatement must return true if the line matchs the statement COPY <relation> (col1, col2, col3...coln) FROM stdin;', () => {
			let line = `COPY public.fatnlong (id, created, updated, name, password) FROM stdin;`
			expect(isStartOfCopyStatement(line)).toBe(true);
			line = `COPY accounting.ac_modules (seq_ac_modules, description, created, createby, backuptype, backuplookback) FROM stdin;`
			expect(isStartOfCopyStatement(line)).toBe(true);
			line = `COPY accounting.acannual_1099e (seq, acannual_1099_seq_seq, payer_federalidnumber, recip_federalidnumber, modified, modifiedby) FROM stdin;`
			expect(isStartOfCopyStatement(line)).toBe(true);
			line = `COPY accounting.acape (seq, acap_seq, federalidnumber, routingnumber, bankaccountnumber, modified, modifiedby) FROM stdin;`
			expect(isStartOfCopyStatement(line)).toBe(true);
			line = `COPY accounting.acglheaderlink (seq, fromseq, toseq, mode, created) FROM stdin;`
			expect(isStartOfCopyStatement(line)).toBe(true);
		});

	});
	describe('isEndOfCopyStatement', () => {

		test('isEndOfCopyStatement must return false if the line does not match the statement \.', () => {
			let line = `ALTER FUNCTION public.insert_fatnlong(pcreated timestamp without time zone) OWNER TO postgres;`
			expect(isEndOfCopyStatement(line)).toBe(false);
			line = `-- Data for Name: acglheaderlink; Type: TABLE DATA; Schema: accounting; Owner: lyadmin`
			expect(isEndOfCopyStatement(line)).toBe(false);
			line = ``
			expect(isEndOfCopyStatement(line)).toBe(false);
			line = `               `;
			expect(isEndOfCopyStatement(line)).toBe(false);
			line = `7	209	199	RANDOM_DATA	2015-03-16 09:10:21.807857`;
			expect(isEndOfCopyStatement(line)).toBe(false);
			line = `COPY accounting.acannual_1099e (seq, acannual_1099_seq_seq, payer_federalidnumber, recip_federalidnumber, modified, modifiedby) FROM stdin;`
			expect(isEndOfCopyStatement(line)).toBe(false);
			line = `SELECT pg_catalog.setval('service.slrocommprefs_seq_seq', 1, false);`
			expect(isEndOfCopyStatement(line)).toBe(false);
		});

		test('isEndOfCopyStatement must return true if the line matchs the statement \.', () => {
			let line = `\\.`
			expect(isEndOfCopyStatement(line)).toBe(true);
		});

	});

	describe('splitCopyStatement', () => {

		test('splitCopyStatement must return an array with the COPY statement splitted like [COPY, <relation>, <columns>, FROM, stdin;]', () => {
			let result = splitCopyStatement('COPY accounting.acglheaderlink (seq, fromseq, toseq, mode, created) FROM stdin;')

			expect(result).toBeArrayOfSize(5);
			expect(result[2]).toBe('(seq, fromseq, toseq, mode, created)');

			result = splitCopyStatement('COPY logging.cm (seq, column_name, old_value, new_value, modified_by, client_addr, query_id, date_modified, record_seq, schema_name, table_name, event) FROM stdin;');
			expect(result).toBeArrayOfSize(5);
			expect(result[2]).toBe('(seq, column_name, old_value, new_value, modified_by, client_addr, query_id, date_modified, record_seq, schema_name, table_name, event)');

			result = splitCopyStatement('COPY public.mn_note (seq, id) FROM stdin;');
			expect(result).toBeArrayOfSize(5);
			expect(result[2]).toBe('(seq, id)');

			result = splitCopyStatement('COPY public.mn_note (seq) FROM stdin;');
			expect(result).toBeArrayOfSize(5);
			expect(result[2]).toBe('(seq)');
		});
	});

	describe('isAFilterFn', () => {

		test('isAFilterFn must return false if the fn label does not follow the standar <source>.<namespace>.<fnname>', () => {

			expect(isAFilterFn('random_srtring')).toBe(false);
			expect(isAFilterFn('fake.test')).toBe(false);
		});

		test('isAFilterFn must return false if the fn source is different to pgfilter', () => {

			expect(isAFilterFn('faker.filter.num')).toBe(false);
		});

		test('isAFilterFn must return false if the fn namespace is different to filter', () => {

			expect(isAFilterFn('pgfilter.random.num')).toBe(false);
		});

		test('isAFilterFn must return true if the fn namespace is equal filter and the source to pgfilter', () => {

			expect(isAFilterFn('pgfilter.filter.fnow')).toBe(true);
		});
	});

	describe('handleSysErrors', () => {
		test('handleSysErrors must always return an Error instance', () => {
			const err = new Error(`custom err`);
			expect(handleSysErrors(err, 'arg1')).toBeInstanceOf(Error);
		});

		test('handleSysErrors must change the error message if the original error code is EONET', () => {
			const err = new Error(`custom err`);
			err.code = 'ENOENT';

			let nerr = handleSysErrors(err, 'arg1')
			expect(nerr).toBeInstanceOf(Error);
			expect(nerr.message).toMatch(/'arg1' must be a valid file path/);
		});

		test('handleSysErrors must change the error message if the original error code is EACCES', () => {
			const err = new Error(`custom err`);
			err.code = 'EACCES';

			let nerr = handleSysErrors(err, 'arg1')
			expect(nerr).toBeInstanceOf(Error);
			expect(nerr.message).toMatch(/'arg1' needs read permissions/);
		});

		test('handleSysErrors must change the error message if the original error is instance of SyntaxError', () => {
			const err = new SyntaxError(`json parsing error`);
			let nerr = handleSysErrors(err, 'arg1')
			expect(nerr).toBeInstanceOf(SyntaxError);
			expect(nerr.message).toMatch(/'arg1' must be a valid JSON document/);
		});

		test('handleSysErrors must use the original error message if it is a no-handle error', () => {
			const err = new Error(`custom err`);
			let nerr = handleSysErrors(err, 'arg1')
			expect(nerr).toBeInstanceOf(Error);
			expect(nerr.message).toMatch(/custom err/);
		});
	});

	describe('validJSONFile', () => {

		const fs = require('fs');
		jest.mock('fs');

		test('validJSONFile must throw an error if the file does not exists', () => {
			expect(() => {
				validJSONFile(`/tmp/test${rn()}.json`);
			}).toThrow();
		});

		test('validJSONFile must throw an error if the file is not a valid JSON file', () => {
			fs.readFileSync = jest.fn();
			fs.readFileSync.mockImplementation(() => `a single string`);
			expect(() => {
				validJSONFile(`/tmp/test${rn()}.json`);
			}).toThrow();
		});
	});

	describe('validFile', () => {

		test('validFile must throw an error if the file does not exists', () => {
			expect(() => {
				validFile(`/tmp/dump${rn()}.dump`);
			}).toThrow();
		});

	});

	describe('validBackupFile', () => {

		test('validBackupFile must throw an error if the file does not exists', () => {
			expect(() => {
				validBackupFile(`/tmp/dump${rn()}.dump`);
			}).toThrow();
		});

		test('validBackupFile must not throw an error if the file is null( STDIN ) and return null', () => {
			expect(validBackupFile(null)).toBe(null);
		});

	});

	describe('validBuffer', () => {

		test('validBuffer must throw an error if the buffer is NaN', () => {
			expect(() => {
				validBuffer(`NaN`);
			}).toThrow(TypeError);
		});

		test('validBuffer must return the buffer if it is valid', () => {
			expect(validBuffer(30)).toBe(30);
		});

		test('validBuffer must round the buffer if it is a fractional number', () => {
			expect(validBuffer(30.1)).toBe(30);
			expect(validBuffer(30.9)).toBe(31);
		});

	});

	describe('inputFromSTDIN', () => {
		test('inputFromSTDIN must return true if the \'backup_file\' property is not present in the yargs parsed object', () => {
			const yargsCLIOptsParsed = {
				b: 0,
				'buffer-length': 0,
				bufferLength: 0,
				s: false,
				'skip-overflow': false,
				skipOverflow: false,
			};

			expect(inputFromSTDIN(yargsCLIOptsParsed)).toBe(true);
		});

		test('inputFromSTDIN must return true if the \'backup_file\' property is null', () => {
			const yargsCLIOptsParsed = {
				b: 0,
				'buffer-length': 0,
				bufferLength: 0,
				s: false,
				'skip-overflow': false,
				skipOverflow: false,
				backup_file: null
			};

			expect(inputFromSTDIN(yargsCLIOptsParsed)).toBe(true);
		});

		test('inputFromSTDIN must return false if the \'backup_file\' property is as valid file path', () => {
			const yargsCLIOptsParsed = {
				b: 0,
				'buffer-length': 0,
				bufferLength: 0,
				s: false,
				'skip-overflow': false,
				skipOverflow: false,
				backup_file: '/backups/my_backup.dump'
			};

			expect(inputFromSTDIN(yargsCLIOptsParsed)).toBe(false);
		});
	});

});
