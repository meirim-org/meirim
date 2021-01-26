const { chartToArrayBuilder } = require('./chartToArrayBuilder');
const { getFromArr } = require('./parsersUtils');
const log = require('../../../log');

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryChart1_6 = (firstPageOfTable, headersStartIndex) => {
	// clean the headers
	firstPageOfTable = firstPageOfTable.map(row => row.map(cell => cell.replace(/\n/g, ' ')
		.replace(/ {2}/g, ' ')
		.trim()));

	if (headersStartIndex === -1) {
		// it's an error
		log.error('didn\'t find headers for some char 1.6');
		return () => {};
	}

	const header = firstPageOfTable[headersStartIndex];

	const planNumberIdx = header.findIndex(title => title.includes('מספר תכנית מאושרת'));
	const kindIdx = header.findIndex(title => title.includes('סוג יחס'));
	const commentIdx = header.findIndex(title => title.includes('הערה ליחס'));
	const yalkootNumberIdx = header.findIndex(title => title.includes('מספר ילקוט פרסומים'));
	const yalkootPageNumberIdx = header.findIndex(title => title.includes('עמוד בילקוט פרסומים'));
	const dateIdx = header.findIndex(title => title.includes('תאריך'));


	return (row) => {
		return {
			planNumberIdx: getFromArr(row, planNumberIdx),
			kindIdx: getFromArr(row, kindIdx),
			commentIdx: getFromArr(row, commentIdx),
			yalkootNumberIdx: getFromArr(row, yalkootNumberIdx),
			yalkootPageNumberIdx: getFromArr(row, yalkootPageNumberIdx),
			dateIdx: getFromArr(row, dateIdx),
		};
	};
};

const extractChartOneSix = (pageTables) => {
	return chartToArrayBuilder({
		pageTables,
		rowAbstractFactory: rowAbstractFactoryChart1_6,
		startOfChartPred: (cell) => cell.includes('יחס בין התכנית לבין תכניות מאושרות קודמות') && cell.includes('1.6'),
		offsetOfRowWithDataInChart: 1,
		chartDonePredicate: (row) => row.some(cell => cell.includes('מסמכי התכנית') && cell.includes('1.7')),
		getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('סוג יחס'))) + searchFrom,
		rowTrimmer: (row) => row.map((cell) => cell.replace(/\n/g, ' ').replace(/ {2}/g, ' ').trim()),
		identifier: '1.6'
	});
};

module.exports = {
	extractChartOneSix
};