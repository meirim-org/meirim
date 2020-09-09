const { extractChartFive } = require ('./chartFive');
const {extractCharts1Point8} = require('./charts1Point8');
const {extractChartFour, processChartFour} = require('./chart4');
const {extractChartSix, processChartSix} = require('./chart6');
const { extractPlanInformation } = require ('./planInformation');
const pdfTableExtractor = require("@florpor/pdf-table-extractor");

function parsePdf(result)
{
  const extractedData = {
    planExplanation:'',
    chartFive:[]
  };

  extractedData.charts18 = extractCharts1Point8(result.pageTables);
  const chartFour = extractChartFour(result.pageTables);
  extractedData.chartFour = processChartFour(chartFour);
  extractedData.chartFive = extractChartFive(result.pageTables);
  const chartSix = extractChartSix(result.pageTables);
  extractedData.chartSix = processChartSix(chartSix);
  extractedData.planExplanation = extractPlanInformation(result.pageTables);
  return extractedData;
}

const extractPdfData = async (path) =>  {
    try{
        const tableData = await pdfTableExtractor(path, {maxEdgesPerPage: 3000})
            .then(data => {
                if (data.pageTables && data.numPages && data.currentPages){
                    const tableData = parsePdf(data);
                    return tableData;
                } else {
                    console.log(`error reading plan instruction pdf`, data)
                }
            });

        return tableData;
    } catch (err){
        console.log(`error reading plan instruction pdf\n` + err.message + '\n' + err.stack)
    }
};

module.exports = {
    extractPdfData
};