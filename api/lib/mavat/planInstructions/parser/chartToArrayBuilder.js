
// this function parses the pdf tables and returns and array of elements
// we need this functionality whenever we want to extract array data from the pdf and supports data which spans multiple pages

/**
 *
 * @param pageTables                            all the tables of all the pages of the pdf
 * @param rowAbstractFactory                    given the first page of a table, construct a factory that builds a datum from a row in the table
 * @param startOfChartText                      this should be the text at the beginning of the chart we're interested in - this is how we determine on which page the chart starts
 * @param startRowOfChartFirstPage              the row where data that is interesting for us starts
 * @param continuationChartText                 if a chart spans more that one page, the text at the beginning of the second page which is the predicate for if the chart continues
 * @param startIndexOfChartContinuatingPage     the row where data that is interesting for us starts on continuating pages
 * @param chartDoneLine                         the text that appears when the chart ends, this is how we know to look no further
 * @param dataRowPredicateFn                    given a row, determine if the row is relevant or we need to skip it
 * @returns {[]}
 */
const pageTablesToDataArray = ({pageTables,
                                 rowAbstractFactory,
                                 startOfChartText,
                                 startRowOfChartFirstPage,
                                 continuationChartText,
                                 startIndexOfChartContinuatingPage,
                                 chartDoneLine,
                                 dataRowPredicateFn}) => {

  const chartRows = [];
  let currentPage = -1;

  pageTables.some((page, i) => {
    if (page.tables[1][0] === startOfChartText){
      currentPage = i;
      return true;
    }
    return false;
  });

  // need to do it for all pages where the chart still exists
  let stillInChart = true;

  while (stillInChart && pageTables[currentPage]){

    // on which row the chart starts - this will be different if the chart just began or a contin uation from the chart from the previous line
    let startIndex;

    // check if we're in the first page of the chart of not, the effects where the rows of data start
    // could do without the check, going first page and then assuming we're at the second page
    // but this makes a bit less assumptions about the structure difference between the first and later pages
    if (pageTables[currentPage].tables[1][0] === startOfChartText){
      startIndex = startRowOfChartFirstPage;
    } else if (pageTables[currentPage].tables[1][0] === continuationChartText){
      startIndex = startIndexOfChartContinuatingPage;
    } else {
      break;
    }

    const newDataRows = pageTables[currentPage].tables;
    const rowFactory = rowAbstractFactory(newDataRows);
    for (let i = startIndex; i < newDataRows.length; i++){

      if (newDataRows[i][0].includes(chartDoneLine)){
        stillInChart = false;
        break;
      }
      if (dataRowPredicateFn(newDataRows[i])){
        const rowTrimmed = newDataRows[i].map(cell => cell.replace(/\n/g, ' ')
                                                          .replace(/ {2}/g, ' ')
                                                          .trim());
        chartRows.push(rowFactory(rowTrimmed));
      }
    }
    currentPage ++;
  }
  return chartRows;
};

module.exports = {
  pageTablesToDataArray
};