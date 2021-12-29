/* src/util.js */

const fs = require('fs');

const validJSONFile = (file) => {
	// let parsed;
	// try {
	let parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
	// } catch (error) {

	// }

	return parsed;
};

const validFile = (file) => {
	if (file)
		return fs.statSync(file);
};

module.exports = {
	validJSONFile,
	validFile
};
