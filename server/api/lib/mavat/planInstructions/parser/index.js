const { extractChartFive } = require('./chartFive');
const { extractChartsOneEight } = require('./chartsOneEight');
const { extractChartOneSix } = require('./chartOneSix');
const { extractChartOneSeven } = require('./chartOneSeven');
const { extractChartFour } = require('./chartFour');
const { extractChartSix } = require('./chartSix');
const { extractChartThreeOne } = require('./chartThreeOne');
const { extractChartThreeTwo } = require('./chartThreeTwo');
const { extractChartSevenOne } = require('./chartSevenOne');
const { getNonTableInOneFour } = require('./textOneFour');
const { extractPlanInformation } = require('./planInformation');
const log = require('../../../log');
const pdfTableExtractor = require('@florpor/pdf-table-extractor');

async function parsePdf (result, path) {
	const extractedData = {
		planExplanation: '',
		chartFive: []
	};

	extractedData.textOneFour = getNonTableInOneFour(result.pageTables);
	extractedData.chartOneSix = extractChartOneSix(result.pageTables);
	extractedData.chartOneSeven = extractChartOneSeven(result.pageTables);
	extractedData.chartsOneEight = extractChartsOneEight(result.pageTables);
	extractedData.chartsThreeOne = extractChartThreeOne(result.pageTables);
	extractedData.chartsThreeTwo = await extractChartThreeTwo(path);
	extractedData.chartFour = extractChartFour(result.pageTables);
	extractedData.chartFive = extractChartFive(result.pageTables);
	extractedData.chartSix = extractChartSix(result.pageTables);
	extractedData.chartSevenOne = extractChartSevenOne(result.pageTables);
	extractedData.planExplanation = extractPlanInformation(result.pageTables);
	return extractedData;
}

const extractPdfData = async (path) => {
	try {
		const tableData = await pdfTableExtractor(path, { maxEdgesPerPage: 3000 })
			.then(async (data) => {
				if (data.pageTables && data.numPages && data.currentPages) {
					const tableData = await parsePdf(data, path);
					return tableData;
				} else {
					log.error('error reading plan instruction pdf', data);
				}
			});

		return tableData;
	} catch (err) {
		log.error('error reading plan instruction pdf\n' + err.message + '\n' + err.stack);
	}
};

module.exports = {
	extractPdfData
};
