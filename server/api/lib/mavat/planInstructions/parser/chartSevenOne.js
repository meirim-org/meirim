const { chartToArrayBuilder } = require('./chartToArrayBuilder');
const { getFromArr } = require('./parsersUtils');
const log = require('../../../log');

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryChart7_1 = (firstPageOfTable, headersStartIndex) => {
	// clean the headers
	firstPageOfTable = firstPageOfTable.map(row => row.map(cell => cell.replace(/\n/g, ' ')
		.replace(/ {2}/g, ' ')
		.trim()));

	if (headersStartIndex === -1) {
		// it's an error
		log.error('didn\'t find headers for some chart 3.1_without_change');
		return () => {};
	}

	const header = firstPageOfTable[headersStartIndex];

	const phaseIndex = header.findIndex(title => title.includes('מספר שלב'));
	const phaseDescription = header.findIndex(title => title.includes('תאור שלב'));
	const conditioning = header.findIndex(title => title.includes('התנייה'));

	return (row) => {
		return {
			phaseIndex: getFromArr(row, phaseIndex),
			phaseDescription: getFromArr(row, phaseDescription),
			conditioning: getFromArr(row, conditioning),
		};
	};
};


const extractChartSevenOne = (pageTables) => {
	return chartToArrayBuilder({
		pageTables,
		rowAbstractFactory: rowAbstractFactoryChart7_1,
		startOfChartPred: (cell) => cell.includes('7.1') && cell.includes('שלבי ביצוע'),
		offsetOfRowWithDataInChart: 1,
		chartDonePredicate: (row) => row.some(cell => cell.includes('7.2') && cell.includes('מימוש התכנית')),
		getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('מספר שלב')) &&
                row.some(cell => cell.includes('תאור שלב')) &&
                row.some(cell => cell.includes('התנייה'))) + searchFrom,
		rowTrimmer: (row) => row.map((cell) => cell.replace(/\n/g, ' ').replace(/ {2}/g, ' ').trim()),
		identifier: '7.1'
	});
};

module.exports = {
	extractChartSevenOne
};