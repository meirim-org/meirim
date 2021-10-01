// This modules helps in parsing landuse changes as we save them in the DB.
// An example structure of a lans use change looks like this:
// '[[{"1":"4000807619","2":"120","3":"מגורים (יח\"ד)"
//,"4":"יח\"ד","5":"+172","6":"","7":"172","8":"","9":""},{"1":"4000807621","2":"125",
//"3":"מגורים (מ\"ר)","4":"מ\"ר","5":"+16,100","6":"","7":"16,100","8":"","9":""}]]'

// All as one long string. Logic is clear when comparing against a MAVAT Plan page

const { find, get, mapValues } = require('lodash');

const LAND_USE_CHANGE_UNITS = {
	units: {
		hebKey: 'יח"ד',
		key: 'units',
		description: 'דירות',
	}, metres: {
		hebKey: 'מ"ר',
		key: 'metres',
		description: 'מ"ר',
	}
};

const LAND_USES = {
	housing: {
		key: 'housing',
		hebKey: 'מגורים',
		getDescriptionText: (unitKey) => {
			if (unitKey === LAND_USE_CHANGE_UNITS.units.key) return '';
			return 'מגורים';
		}
	}, 
	commerce: {
		key: 'commerce',
		hebKey: 'תעסוקה',
		getDescriptionText: (unitKey) => {
			if (unitKey === LAND_USE_CHANGE_UNITS.units.key) return '';
			return 'תעסוקה';
		}
	} };

const INCREASE_KEY = '+';
const DECREASE_KEY = '-';

const parseLandUses = (changes) => {
	const mappedChanges = {};
	changes[0].forEach(change => {
		const { key: landUseKey } = find(LAND_USES, landUse=> change[3].includes(landUse.hebKey));
		const value = Number(change[7].replace(',',''));
		const { key: unitKey } = find(LAND_USE_CHANGE_UNITS, unit=> change[4].includes(unit.hebKey));
		const changeMultiplier =  change[5].includes(INCREASE_KEY)? 1 : -1;

		if (landUseKey && value && unitKey){
			if (!mappedChanges[landUseKey]) mappedChanges[landUseKey] = {};
			if (!mappedChanges[landUseKey][unitKey]) mappedChanges[landUseKey][unitKey] = 0;
			mappedChanges[landUseKey][unitKey] += changeMultiplier * value;
		}
	});

	return mappedChanges;
};

const describeChange = (mappedChanges, landUseKey, unitKey) => {
	const changeValue = get(mappedChanges, `${landUseKey}.${unitKey}`, 0);
	if (changeValue === 0) return;
	const sign = changeValue >=0 ? INCREASE_KEY : DECREASE_KEY;
	const units = LAND_USE_CHANGE_UNITS[unitKey].description;
	return `${changeValue}${sign} ${units} ${LAND_USES[landUseKey].getDescriptionText(unitKey)}`;
};

module.exports = {
	LAND_USES: mapValues(LAND_USES, (u)=> u.key),
	LAND_USE_CHANGE_UNITS: mapValues(LAND_USE_CHANGE_UNITS, (u)=> u.key),
	parseLandUses,
	describeChange
};
