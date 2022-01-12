/* test/lib/utils.spec.js */

const {
	isStartOfCopyStatement,
	isEndOfCopyStatement,
	splitCopyStatement,
	isAFilterFn
} = require('../../lib/utils');


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

});
