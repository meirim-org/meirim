
// this function parses the pdf tables and returns and array of elements
// we need this functionality whenever we want to extract array data from the pdf and supports data which spans multiple pages

/**
 *
 * @param pageTables                            all the tables of all the pages of the pdf
 * @param rowAbstractFactory                    given the first page of a table, construct a factory that builds a datum from a row in the table
 * @param startOfChartText                      this should be the text at the beginning of the chart we're interested in - this is how we determine on which page the chart starts
 * @param offsetOfRowWithDataInChart            the offset to the row where data that is interesting for us starts
 * @param chartDonePredicate                    predicate that take row as input as return true if we are outside of the chart
 * @param dataRowPredicateFn                    given a row, determine if the row is relevant or we need to skip it
 * @param getHeaderRowIndex                     given a page, returns the index of the chart header in him. If no chart header is found, returns -1
 * @param identifier                            table name for debug and logs
 * @returns {[]}
 */
const pageTablesToDataArray = ({pageTables,
                                 rowAbstractFactory,
                                 startOfChartPred,
                                 offsetOfRowWithDataInChart,
                                 chartDonePredicate,
                                 dataRowPredicateFn,
                                 getHeaderRowIndex,
                                 identifier}) => {

  const chartRows = [];

  let currentPageIndex = findPageWithStartOfChart(pageTables, startOfChartPred);
  if (currentPageIndex === -1) {
      console.error(`didn't find the starting page of chart ${identifier}`);
      return [];   //didn't find the page, return an empty chart
  }


  // need to do it for all pages where the chart still exists
  let stillInChart = true;
  let firstChartPage = true;

  while (stillInChart && pageTables[currentPageIndex]){

      const indexOfHeader = getHeaderRowIndex(pageTables[currentPageIndex].tables);
      if (indexOfHeader === -1) {
          console.error(`didn't find the header of chart ${identifier}`);
          return [];  //didn't find the table inside page, return an empty chart
      }
      else if (!firstChartPage && !isFirstNotNoiseRow(pageTables[currentPageIndex], indexOfHeader)) {
          // found the header on a non-first page of the chart, but it's not in the right position
          // or the previous table is done and we moved a page to a different table
          return chartRows;
      }

    const indexOfData = indexOfHeader + offsetOfRowWithDataInChart;

    const newDataRows = pageTables[currentPageIndex].tables;
    const rowFactory = rowAbstractFactory(newDataRows);
    for (let i = indexOfData; i < newDataRows.length; i++){

      if (chartDonePredicate(newDataRows[i])){
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

    firstChartPage = false;
    currentPageIndex++;
  }
  return chartRows;
};

// find the page that the chart is starting at
const findPageWithStartOfChart = (pageTables, startOfChartPred) => {
    for (let pageIndex = 0; pageIndex < pageTables.length; pageIndex++) {
        const page = pageTables[pageIndex].tables;

        for (let rowIndex = 0; rowIndex < page.length; rowIndex++) {
            const row = page[rowIndex];

            if (startOfChartPred(row[0])) {
                return pageIndex;
            }
        }
    }
    return -1;
};


//returns true if the row in the given index is the first row that is not a noise row (noise row is a row with empty cells only)
const isFirstNotNoiseRow = (page, rowIndex) => {
    for (let i = 0; i < rowIndex; i++) {
        if (!page.tables[i].every(cell => cell === '')) {
            return false;
        }
    }
    return true;
};

module.exports = {
  pageTablesToDataArray
};