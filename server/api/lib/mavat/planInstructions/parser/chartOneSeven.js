const { chartToArrayBuilder } = require('./chartToArrayBuilder');
const { getFromArr } = require('./parsersUtils');
const log = require('../../../log');

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryChart1_7 = (firstPageOfTable, headersStartIndex) => {
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

	const kindIdx = header.findIndex(title => title.includes('סוג המסמך'));
	const containsIdx = header.findIndex(title => title.includes('תחולה'));
	const scaleIdx = header.findIndex(title => title.includes('קנה מידה'));
	const numberOfPagesIdx = header.findIndex(title => title.includes('מספר עמודים'));
	const editDateIdx = header.findIndex(title => title.includes('תאריך עריכה'));
	const editorIdx = header.findIndex(title => title.includes('עורך המסמך'));
	const creationDateIdx = header.findIndex(title => title.includes('תאריך יצירה'));
	const descriptionIdx = header.findIndex(title => title.includes('תיאור המסמך'));
	const includedIdx = header.findIndex(title => title.includes('נכלל בהוראות התכנית'));



	return (row) => {
		return {
			kindIdx: getFromArr(row, kindIdx),
			containsIdx: getFromArr(row, containsIdx),
			scaleIdx: getFromArr(row, scaleIdx),
			numberOfPagesIdx: getFromArr(row, numberOfPagesIdx),
			editDateIdx: getFromArr(row, editDateIdx),
			editorIdx: getFromArr(row, editorIdx),
			creationDateIdx: getFromArr(row, creationDateIdx),
			descriptionIdx: getFromArr(row, descriptionIdx),
			includedIdx: getFromArr(row, includedIdx),
		};
	};
};

const extractChartOneSeven = (pageTables) => {
	return chartToArrayBuilder({
		pageTables,
		rowAbstractFactory: rowAbstractFactoryChart1_7,
		startOfChartPred: (cell) => cell.includes('מסמכי התכנית') && cell.includes('1.7'),
		offsetOfRowWithDataInChart: 1,
		chartDonePredicate: (row) => row.some(cell => cell.includes('כל מסמכי התכנית מהווים חלק בלתי נפרד ממנה')),
		getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('סוג המסמך'))) + searchFrom,
		rowTrimmer: (row) => row.map((cell) => cell.replace(/\n/g, ' ').replace(/ {2}/g, ' ').trim()),
		identifier: '1.7'
	});
};

module.exports = {
	extractChartOneSeven
};