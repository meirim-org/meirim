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
			phase: getFromArr(row, phaseIndex),
			phase_description: getFromArr(row, phaseDescription),
			conditioning: getFromArr(row, conditioning),
		};
	};
};


const extractChartSevenOne = (pageTables) => {
	const rowsFromBuilder = chartToArrayBuilder({
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

	const newRows = [];

	for (let i = 0; i < rowsFromBuilder.length; i++) {
		const currRow = rowsFromBuilder[i];

		if (currRow.phase === '' && newRows.length > 0) {
			const lastFromNewRows = newRows[newRows.length - 1];

			lastFromNewRows.phase_description += ' ' + currRow.phase_description;
			lastFromNewRows.conditioning += ' ' + currRow.conditioning;
		}

		else {
			newRows.push(currRow);
		}

	}

	return newRows;

};

module.exports = {
	extractChartSevenOne
};