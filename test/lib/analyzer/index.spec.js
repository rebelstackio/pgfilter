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
	"pulbic.city": {
		"city": "faker.address.city"
	},
	"pulbic.country": {
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

	test('_checkRelationFromArr must set relation/table as null in the Analyzer if the table/relation is not present in the pgfilter file', () => {
		const an = new Analyzer(PGFILTER_PARSED_FILE, debug);

		const line = `SELECT random.function_cal(1, 2, 3)`;
		an._checkRelationFromArr(splitCopyStatement(line));
		expect(an.relation).toBe(null);
	});

});
