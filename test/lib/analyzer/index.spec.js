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

let debug;

describe('Analyzer', () => {

	beforeEach(() => {
		debug = jest.fn();
	});

	test('Analyzer must call the debug function always at contructuor level', () => {
		new Analyzer(PGFILTER_PARSED_FILE, debug);

		expect(debug).toHaveBeenCalled();
	});

	describe('_setMappedRelation', () => {
		test('_setMappedRelation must set null if the statement from the backup file is not related to importing data(COPY)', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, debug);

			const line = `SELECT random.function_cal(1, 2, 3)`;
			an._setMappedRelation(splitCopyStatement(line));
			expect(an.relation).toBe(null);
		});

		test('_setMappedRelation must set the relation/table if the table/relation is present in the pgfilter file', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, debug);

			let line = `COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;`;
			an._setMappedRelation(splitCopyStatement(line));
			expect(an.relation).toBe('public.actor');
			line = `COPY public.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) FROM stdin;`;
			an._setMappedRelation(splitCopyStatement(line));
			expect(an.relation).toBe('public.address');
		});

		test('_setMappedRelation must set null if the table/relation is not present in the pgfilter file', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, debug);

			let line = `COPY public.category (category_id, name, last_update) FROM stdin;`;
			an._setMappedRelation(splitCopyStatement(line));
			expect(an.relation).toBe(null);
		});
	});

	describe('_setColumnsFromLine', () => {
		test('_setColumnsFromLine must set the columns in the variable _columns from the COPY FROM statement line as an array to use the index for fast location', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, debug);

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
			const an = new Analyzer(PGFILTER_PARSED_FILE, debug);
			let line = `CREATE FUNCTION TEST...`;
			an._setMappedRelation(splitCopyStatement(line));
			an._setColumnsFromLine(splitCopyStatement(line));
			an._setAffectedColumns();

			expect(an.affectedColumns).toBe(null);
		});

		test('_setAffectedColumns must set an array with the index positions of the columns that requires transformation/filtering', () => {
			const an = new Analyzer(PGFILTER_PARSED_FILE, debug);

			let line = `COPY public.actor (actor_id, first_name, last_name, last_update) FROM stdin;`;
			let tkns = splitCopyStatement(line);
			an._setMappedRelation(tkns);
			an._setColumnsFromLine(tkns);
			an._setAffectedColumns();
			expect(an.affectedColumns).toBeArrayOfSize(2);
			expect(an.affectedColumns[0]).toBe(1); // first_name
			expect(an.affectedColumns[1]).toBe(2); // last_name

			line = `COPY public.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) FROM stdin;`;
			an._setMappedRelation(splitCopyStatement(line));
			an._setColumnsFromLine(splitCopyStatement(line));
			an._setAffectedColumns();
			expect(an.affectedColumns).toBeArrayOfSize(3);
			expect(an.affectedColumns[0]).toBe(1); // address
			expect(an.affectedColumns[1]).toBe(2); // address2
			expect(an.affectedColumns[2]).toBe(6); //phone
		});

	});
});
