const { chartToArrayBuilder } = require('./chartToArrayBuilder');
const { getFromArr } = require('./parsersUtils');
const log = require('../../../log');

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryCharts3_1_without_change = (firstPageOfTable, headersStartIndex) => {
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

	const designationIndex = header.findIndex(title => title.includes('יעוד'));
	const fieldCells = header.findIndex(title => title.includes('תאי שטח'));

	return (row) => {
		return {
			designation: getFromArr(row, designationIndex),
			fieldCells: getFromArr(row, fieldCells),
		};
	};
};

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryCharts3_1_with_change = (firstPageOfTable, headersStartIndex) => {
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

	const tasritMarking = header.findIndex(title => title.includes('סימון בתשריט'));
	const designationIndex = header.findIndex(title => title.includes('יעוד'));
	const fieldCells = header.findIndex(title => title.includes('תאי שטח כפופים'));

	return (row) => {
		return {
			tasritMarking: getFromArr(row, tasritMarking),
			designation: getFromArr(row, designationIndex),
			fieldCells: getFromArr(row, fieldCells),
		};
	};
};

const extractChartThreeOne = (pageTables) => {
	return {
		'3.1_without_change': chartToArrayBuilder({
			pageTables,
			rowAbstractFactory: rowAbstractFactoryCharts3_1_without_change,
			startOfChartPred: (cell) => cell.includes('3.1') && cell.includes('טבלת יעודי קרקע ותאי שטח בתכנית'),
			offsetOfRowWithDataInChart: 1,
			chartDonePredicate: (row) => row.some(cell => cell.includes('3.2') && cell.includes('טבלת שטחים') ||
				(row.some(cell => cell.includes('סימון בתשריט'))) &&
				row.some(cell => cell.includes('יעוד')) &&
				row.some(cell => cell.includes('תאי שטח כפופים'))),
			getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('יעוד')) &&
				row.some(cell => cell.includes('תאי שטח')) &&
				!row.some(cell => cell.includes('3.1'))) + searchFrom,
			rowTrimmer: (row) => row.map((cell) => cell.replace(/\n/g, ' ').replace(/ {2}/g, ' ').trim()),
			identifier: '3.1_without_change'
		}),
		'3.1_with_change': chartToArrayBuilder({
			pageTables,
			rowAbstractFactory: rowAbstractFactoryCharts3_1_with_change,
			shouldHappenBeforeTbl: (cell) => cell.includes('3.1') && cell.includes('טבלת יעודי קרקע ותאי שטח בתכנית'),
			startOfChartPred: (cell) => cell.includes('תאי שטח כפופים'),
			offsetOfRowWithDataInChart: 1,
			chartDonePredicate: (row) => row.some(cell => cell.includes('3.2') && cell.includes('טבלת שטחים')),
			getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('יעוד')) &&
				row.some(cell => cell.includes('תאי שטח כפופים')) &&
				row.some(cell => cell.includes('סימון בתשריט'))) + searchFrom,
			rowTrimmer: (row) => row.map((cell) => cell.replace(/\n/g, ' ').replace(/ {2}/g, ' ').trim()),
			identifier: '3.1_with_change'
		})
	};

};

module.exports = {
	extractChartThreeOne
};