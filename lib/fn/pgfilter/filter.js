/* lib/fn/pgfilter/filter.js */
'use strict';

const fnow = function _fnow(val, ISO8601DUR) {
	if (!ISO8601DUR || typeof ISO8601DUR !== 'string') {
		throw new Error(`duration argument is required`);
	}

	const date = new Date(val);
	let rx = /^P(?=\d+[YMWD])(?<years>\d+Y)?(?<months>\d+M)?(?<weeks>\d+W)?(?<days>\d+D)?(T(?=\d+[HMS])(?<hours>\d+H)?(?<minutes>\d+M)?(?<seconds>\d+S)?)?$/;
	let matches = ISO8601DUR.match(rx);
	let cd = new Date();
	if (matches.groups.years) cd = cd.setYear(cd.getFullYear() - parseInt(matches.groups.years.slice(0, matches.groups.years.length - 1)));
	if (matches.groups.months) cd = cd.setMonth(cd.getMonth() - parseInt(matches.groups.months.slice(0, matches.groups.months.length - 1)));
	if (matches.groups.weeks) cd = cd.setWeek(cd.getWeek() - parseInt(matches.groups.weeks.slice(0, matches.groups.weeks.length - 1)));
	if (matches.groups.days) cd = cd.setDate(cd.getDate() - parseInt(matches.groups.days.slice(0, matches.groups.days.length - 1)));
	if (matches.groups.hours) cd = cd.setHours(cd.getHours() - parseInt(matches.groups.hours.slice(0, matches.groups.hours.length - 1)));
	if (matches.groups.minutes) cd = cd.setMinutes(cd.getMinutes() - parseInt(matches.groups.minutes.slice(0, matches.groups.minutes.length - 1)));
	if (matches.groups.seconds) cd = cd.setSeconds(cd.getSeconds() - parseInt(matches.groups.seconds.slice(0, matches.groups.seconds.length - 1)));
	if (date >= cd) return true;
	else return false;
};

module.exports = {
	fnow
};
