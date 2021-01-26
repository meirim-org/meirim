const { chartToArrayBuilder } = require('./chartToArrayBuilder');
const { getFromArr } = require('./parsersUtils');
const log = require('../../../log');

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryCharts3_2 = (firstPageOfTable, headersStartIndex) => {
	// clean the headers
	firstPageOfTable = firstPageOfTable.map(row => row.map(cell => cell.replace(/\n/g, ' ')
		.replace(/ {2}/g, ' ')
		.trim()));

	if (headersStartIndex === -1) {
		// it's an error
		log.error('didn\'t find headers for some chart 3.2');
		return () => {};
	}

	const header = firstPageOfTable[headersStartIndex];

	const designationIndex = header.findIndex(title => title.includes('יעוד'));
	const mrIndex = header.findIndex(title => title.includes('מ"ר'));
	const percentageIndex = header.findIndex(title => title.includes('אחוזים'));

	return (row) => {
		return {
			designation: getFromArr(row, designationIndex),
			mr: getFromArr(row, mrIndex),
			percentage: getFromArr(row, percentageIndex),
		};
	};
};

const extractChartThreeTwo = (pageTables) => {
	return {
		chart3_2_approved: chartToArrayBuilder({
			pageTables,
			rowAbstractFactory: rowAbstractFactoryCharts3_2,
			shouldHappenBeforeTbl: (cell) => cell.includes('3.2') && cell.includes('טבלת שטחים'),
			startOfChartPred: (cell) => cell === 'מצב מאושר',
			offsetOfRowWithDataInChart: 1,
			chartDonePredicate: (row) => row.some(cell => cell.includes('סה"כ')),
			getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('יעוד'))) + searchFrom,
			rowTrimmer: (row) => row.map((cell) => cell.replace(/\n/g, ' ').replace(/ {2}/g, ' ').trim()),
			identifier: '3.2_approved'
		}),
		chart3_2_suggested: chartToArrayBuilder({
			pageTables,
			rowAbstractFactory: rowAbstractFactoryCharts3_2,
			shouldHappenBeforeTbl: (cell) => cell.includes('3.2') && cell.includes('טבלת שטחים'),
			startOfChartPred: (cell) => cell === 'מצב מוצע',
			offsetOfRowWithDataInChart: 1,
			chartDonePredicate: (row) => row.some(cell => cell.includes('סה"כ')),
			getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('יעוד'))) + searchFrom,
			rowTrimmer: (row) => row.map((cell) => cell.replace(/\n/g, ' ').replace(/ {2}/g, ' ').trim()),
			identifier: '3.2_suggested'
		}),
	};
};

module.exports = {
	extractChartThreeTwo
};