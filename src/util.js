/* src/util.js */

const fs = require('fs');

const handleSysErrors = (err, arg = 'argument') => {
	switch (true) {
		case err.code === 'ENOENT':
			err.message = `'${arg}' must be a valid file path`;
			break;
		case err.code === 'EACCES':
			err.message = `'${arg}' needs read permissions`;
			break;
		case err instanceof SyntaxError:
			err.message = `'${arg}' must be a valid JSON document`;
			break;
	}
	return err;
};

const validJSONFile = (file, arg) => {
	let parsed, err = null;
	try {
		parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
	} catch (error) {
		err = handleSysErrors(error, arg);
	}

	if (err) {
		throw err;
	}

	return parsed;
};

const validFile = (file, arg) => {
	let stat, err = null;
	try {
		stat = fs.statSync(file);
	} catch (error) {
		err = handleSysErrors(error, arg);
	}

	if (err) {
		throw err;
	}

	return stat;
};

module.exports = {
	validJSONFile,
	validFile,
	handleSysErrors
};
