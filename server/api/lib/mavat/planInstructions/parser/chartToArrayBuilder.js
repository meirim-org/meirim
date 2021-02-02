// this function parses the pdf tables and returns and array of elements
// we need this functionality whenever we want to extract array data from the pdf and supports data which spans multiple pages

/**
 *
 * @param pageTables                            all the tables of all the pages of the pdf
 * @param rowAbstractFactory                    given the first page of a table, construct a factory that builds a datum from a row in the table
 * @param shouldHappenBeforeTbl 				@nullable given a cell, returns true if you can start to search the table after this cell was found
 * @param startOfChartText                      this should be the text at the beginning of the chart we're interested in - this is how we determine on which page the chart starts
 * @param offsetOfRowWithDataInChart            the offset to the row where data that is interesting for us starts
 * @param chartDonePredicate                    predicate that take row as input as return true if we are outside of the chart
 * @param getHeaderRowIndex                     given a page and the index of the title of the chart (0 if it's the second page of the chart), returns the index of the chart header in him. If no chart header is found, returns -1
 * @param rowTrimmer                            accepts an array (a row) as argument and returns the row trimmed (should be same dimensions)
 * @param identifier                            table name for debug and logs
 * @returns {[]}
 */
const pageTablesToDataArray = ({
	pageTables,
	rowAbstractFactory,
	shouldHappenBeforeTbl,
	startOfChartPred,
	offsetOfRowWithDataInChart,
	chartDonePredicate,
	getHeaderRowIndex,
	rowTrimmer,
	identifier,
}) => {
	const chartRows = [];
	if (shouldHappenBeforeTbl === undefined) {
		shouldHappenBeforeTbl = (cell) => true;
	}

	const indexObj = findPageWithStartOfChart(pageTables, startOfChartPred, shouldHappenBeforeTbl);
	let currentPageIndex = indexObj.pageIndex;
	const titleIndexInFirstPage = indexObj.indexOfTitleInPage;
	if (currentPageIndex === -1) {
		// it's fine sometimes - tables like 1.8.3 can be missing
		return []; // didn't find the page, return an empty chart
	}

	// need to do it for all pages where the chart still exists
	let stillInChart = true;
	let firstChartPage = true;

	while (stillInChart && pageTables[currentPageIndex]) {
		const indexOfHeader = firstChartPage
			? getHeaderRowIndex(
				pageTables[currentPageIndex].tables,
				titleIndexInFirstPage
			)
			: getHeaderRowIndex(pageTables[currentPageIndex].tables, 0);
		if (indexOfHeader === -1) {
			// it can be the page after the last page of the chart
			return chartRows;
		} else if (
			!firstChartPage &&
            !isFirstNotNoiseRow(pageTables[currentPageIndex], indexOfHeader)
		) {
			// found the header on a non-first page of the chart, but it's not in the right position
			// or the previous table is done and we moved a page to a different table
			return chartRows;
		}

		const indexOfData = indexOfHeader + offsetOfRowWithDataInChart;

		const newDataRows = pageTables[currentPageIndex].tables;
		const rowFactory = rowAbstractFactory(newDataRows, indexOfHeader);
		for (let i = indexOfData; i < newDataRows.length; i++) {
			if (chartDonePredicate(newDataRows[i])) {
				stillInChart = false;
				break;
			}
			if (dataRowPredicateFn(newDataRows[i])) {
				const rowTrimmed = rowTrimmer(newDataRows[i]);
				if (!rowTrimmed.every(val => val === undefined && val === '')) {
					const row = rowFactory(rowTrimmed);
					if (Object.values(row).some(val => val !== undefined)) {
						chartRows.push(row);
					}
				}
			}
		}

		firstChartPage = false;
		currentPageIndex++;
	}
	return chartRows;
};

// find the page that the chart is starting at
const findPageWithStartOfChart = (pageTables, startOfChartPred, shouldHappenBeforeTbl) => {
	let hasHappened = false;
	for (let pageIndex = 0; pageIndex < pageTables.length; pageIndex++) {
		const page = pageTables[pageIndex].tables;

		for (let rowIndex = 0; rowIndex < page.length; rowIndex++) {
			const row = page[rowIndex];

			for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
				if (!hasHappened && shouldHappenBeforeTbl(row[cellIndex])) {
					hasHappened = true;
				}
				if (hasHappened && startOfChartPred(row[cellIndex])) {
					return {
						pageIndex: pageIndex,
						indexOfTitleInPage: rowIndex
					};
				}
			}
		}
	}
	return {
		pageIndex: -1,
		indexOfTitleInPage: -1
	};
};

// returns true if the row is not empty
const dataRowPredicateFn = (row) => {
	return row.some((cell) => cell !== undefined && cell.trim() !== '');
};

// returns true if the row in the given index is the first row that is not a noise row (noise row is a row with empty cells only)
const isFirstNotNoiseRow = (page, rowIndex) => {
	for (let i = 0; i < rowIndex; i++) {
		if (!page.tables[i].every((cell) => cell === '')) {
			return false;
		}
	}
	return true;
};

module.exports = {
	chartToArrayBuilder: pageTablesToDataArray
};
