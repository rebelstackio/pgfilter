/* src/util.js */
const fs = require('fs');

const validJSONFile = (file) => {
	return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

const validFile = (file) => {
	if (file)
		return fs.statSync(file);
};

module.exports = {
	validJSONFile,
	validFile
};
