
const moment = require('moment');
const TIMEZONE_DIFF = 3;

const formatDate =(strDate, inputHour, inputFormat) =>{
	if (strDate == '' || strDate == undefined) return undefined;
	const format = inputFormat || 'DD/MM/YYYY';
	const hour = inputHour || '09:00';
	//Date - the hours addition to resolve  tz issues
	const isoDate = moment(strDate, format).add(TIMEZONE_DIFF, 'hours').toISOString().split('T')[0]; 
	return `${isoDate}T${hour}`;
};

module.exports = {
	formatDate,
};