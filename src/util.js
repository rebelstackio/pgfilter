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
	let err = null;
	try {
		fs.accessSync(file, fs.constants.R_OK);
	} catch (error) {
		err = handleSysErrors(error, arg);
	}

	if (err) {
		throw err;
	}

	return file;
};

const validBackupFile = (file, arg) => {
	if (file === null) {
		return file;
	}

	return validFile(file, arg);
};

const validBuffer = (buffer, arg) => {
	let err = null;
	if (isNaN(buffer)) {
		err = handleSysErrors(
			new TypeError(`'${arg}' must be a integer`),
			arg
		);
	}

	if (err) {
		throw err;
	}

	return Math.round(buffer);
};

const comesFromSTDIN = (yargsParsedOpts, prop = 'backup_file') => {

	if (Object.prototype.hasOwnProperty.call(yargsParsedOpts, prop)) {
		return yargsParsedOpts[prop] === null;
	} else {
		return true;
	}
};

module.exports = {
	validJSONFile,
	validBackupFile,
	handleSysErrors,
	validBuffer,
	comesFromSTDIN
};
