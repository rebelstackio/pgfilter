/* test/lib/analyzer/index.spec.js */

const Analyzer = require('../../../lib/analyzer');
const { splitCopyStatement } = require('../../../lib/utils');

const PGFILTER_PARSED_FILE = {
	"public.actor": {
		"first_name": "faker.name.firstName",
		"last_name": "faker.name.lastName",
	},
	"public.address": {
		"address": "faker.address.streetName",
		"address2": "faker.address.streetName",
		"phone": "faker.phone.phoneNumber"
	},
	"public.city": {
		"city": "faker.address.city"
	},
	"public.country": {
		"country": "faker.address.country",
	},
	"public.customer": {
		"first_name": "faker.name.firstName",
		"last_name": "faker.name.lastName",
		"email": "faker.internet.email"
	},
	"public.amount": {
		"amount": "faker.datatype.number"
	}
};

let verboseMode = false;

describe('Analyzer', () => {

	describe('_setMappedRelation', () => {
		test('_setMappedRelation must set null if the statement from the backup file is not related to importing data(COPY)', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			const line = `SELECT random.function_cal(1, 2, 3)`;
			an._setMappedRelation(splitCopyStatement(line));
			expect(an.relation).toBe(null);
		});

		test('_setMappedRelation must set the relation/table if the table/relation is present in the pgfilter file', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			let line = `COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;`;
			an._setMappedRelation(splitCopyStatement(line));
			expect(an.relation).toBe('public.actor');
			line = `COPY public.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) FROM stdin;`;
			an._setMappedRelation(splitCopyStatement(line));
			expect(an.relation).toBe('public.address');
		});

		test('_setMappedRelation must set null if the table/relation is not present in the pgfilter file', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			let line = `COPY public.category (category_id, name, last_update) FROM stdin;`;
			an._setMappedRelation(splitCopyStatement(line));
			expect(an.relation).toBe(null);
		});
	});

	describe('_setColumnsFromLine', () => {
		test('_setColumnsFromLine must set the columns in the variable _columns from the COPY FROM statement line as an array to use the index for fast location', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			let line = `COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;`;
			an._setColumnsFromLine(splitCopyStatement(line));
			expect(an.columns).toBeArrayOfSize(4);
			expect(an.columns[0]).toBe('actor_id');
			expect(an.columns[1]).toBe('first_name');
			expect(an.columns[2]).toBe('last_name');
			expect(an.columns[3]).toBe('last_update');


			line = `COPY public.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) FROM stdin;`;
			an._setColumnsFromLine(splitCopyStatement(line));
			expect(an.columns).toBeArrayOfSize(8);
			expect(an.columns[0]).toBe('address_id');
			expect(an.columns[1]).toBe('address');
			expect(an.columns[2]).toBe('address2');
			expect(an.columns[3]).toBe('district');
			expect(an.columns[4]).toBe('city_id');
			expect(an.columns[5]).toBe('postal_code');
			expect(an.columns[6]).toBe('phone');
			expect(an.columns[7]).toBe('last_update');

			line = `COPY public.country (country_id, country, last_update) FROM stdin;`;
			an._setColumnsFromLine(splitCopyStatement(line));
			expect(an.columns).toBeArrayOfSize(3);
			expect(an.columns[0]).toBe('country_id');
			expect(an.columns[1]).toBe('country');
			expect(an.columns[2]).toBe('last_update');
		});
	});

	describe('_setAffectedColumns', () => {
		test('_setAffectedColumns must set as null if the _columns and _relation are nulls', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);
			let line = `CREATE FUNCTION TEST...`;
			an._setMappedRelation(splitCopyStatement(line));
			an._setColumnsFromLine(splitCopyStatement(line));
			an._setAffectedColumns();

			expect(an.affectedTransColnsIdx).toBe(null);
		});

		test('_setAffectedColumns must set an array with the index positions of the columns that requires transformation/filtering', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			let line = `COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;`;
			let tkns = splitCopyStatement(line);
			an._setMappedRelation(tkns);
			an._setColumnsFromLine(tkns);
			an._setAffectedColumns();
			expect(an.affectedTransColnsIdx).toBeArrayOfSize(2);
			expect(an.affectedTransColnsIdx[0]).toBe(1); // first_name
			expect(an.affectedTransColnsIdx[1]).toBe(2); // last_name

			line = `COPY public.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) FROM stdin;`;
			an._setMappedRelation(splitCopyStatement(line));
			an._setColumnsFromLine(splitCopyStatement(line));
			an._setAffectedColumns();
			expect(an.affectedTransColnsIdx).toBeArrayOfSize(3);
			expect(an.affectedTransColnsIdx[0]).toBe(1); // address
			expect(an.affectedTransColnsIdx[1]).toBe(2); // address2
			expect(an.affectedTransColnsIdx[2]).toBe(6); //phone
		});
	});

	describe('check', () => {
		test('check method must return null if the relation is not mapped in the pgfilter file', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			const line = `COPY public.random (random_id, random_col1, random_col2) FROM stdin;`;
			let rel = an.check(line);
			expect(rel).toBe(null);
		});

		test('check method must return the table name if the relation is mapped in the pgfilter file', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			const line = `COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;`;
			let rel = an.check(line);
			expect(rel).toBe('public.actor');
		});
	});

	describe('_applyFn', () => {
		test('_applyFn must return the val argument if the function label is not valid', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			expect(an._applyFn('test.default.name', 'John')).toBe('John')
		});

		test('_applyFn must change the val argument if the function label is valid', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);

			expect(an._applyFn('faker.name.firstName', 'John')).not.toBe('John');
		});

		test('_applyFn must call the function with all the arguments involved', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);
			let colVal = 'mytest'
			const res = an._applyFn('pgfilter.filter.ftest-1-2-3', colVal)
			expect(res).toHaveProperty('val', colVal);
			expect(res).toHaveProperty('arg1', 1);
			expect(res).toHaveProperty('arg2', 2);
			expect(res).toHaveProperty('arg3', 3);
		});
	});

	describe('_transform', () => {
		test('_transform must return a differnt line for a mapped relation on the pgfilter file', () => {
			let rline, dline;
			const an = new Analyzer(PGFILTER_PARSED_FILE, verboseMode);
			const cline = 'COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;';
			an.check(cline);

			dline = '1	Penelope	Guiness	2013-05-26 14:47:57.62';
			rline = an._transform(dline);
			expect(rline).not.toBe(dline);

			dline = '4	Jennifer	Davis	2013-05-26 14:47:57.62'
			rline = an._transform(dline);
			expect(rline).not.toBe(dline);
		});
	});
});
