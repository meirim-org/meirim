const { extractChartFive } = require ('./chartFive');
const {extractCharts1Point8} = require('./charts1Point8');
const { extractPlanInformation } = require ('./planInformation');
let pdf_table_extractor = require("pdf-table-extractor");

const { promisify } = require('util');

const pdfTableExtractor = promisify(pdf_table_extractor);

function parsePdf(result)
{
  const extractedData = {
    planExplanation:'',
    chartFive:[]
  };

  extractedData.chartFive = extractChartFive(result.pageTables);
  extractedData.charts18 = extractCharts1Point8(result.pageTables);
  extractedData.planExplanation = extractPlanInformation(result.pageTables);
  return extractedData
}

const extractPdfData = async (path) =>  {
    try{
        const data = await pdfTableExtractor(path);

        // it never gets here
        const tableData = success(data);
        return tableData;
    } catch (data){
        // for some reason it throws an error but the object is the data we actually need
        // check that we actually get the data in the right format  and it's not an error
        if (data.pageTables && data.numPages && data.currentPages){
            const tableData = parsePdf(data);
            return tableData;
        } else {
            console.log(`error reading plan instruction pdf`, data)
        }
    }
};

module.exports = {
    extractPdfData
};