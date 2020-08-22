const { pageTablesToDataArray } = require('./chartToArrayBuilder');
const {startChart5Predicate} = require('./chartFive');

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactory = (firstPageOfTable, headersStartIndex) => {
    // firstPageOfTable should be table with 2 columns
    // the column of the clause should be the one that has "6.1" in it if we are in the first page for example.

    const getFromArr = (arr, index) => {
        return index === undefined || index === -1 ? undefined : arr[index];
    };

    //clean the headers
    firstPageOfTable = firstPageOfTable.map(row => row.map(cell => cell.replace(/\n/g, ' ')
        .replace(/ {2}/g, ' ')
        .trim()));

    if (headersStartIndex === -1) {
        console.log("didn't find headers");
        return (row => {});
    }

    const header = firstPageOfTable[headersStartIndex];

    const clauseNumberIndex = header.findIndex(title => /^6\.\d+$/.exec(title) !== null);
    if(clauseNumberIndex === -1) {
        // the data is a mess. There are some pdfs that are a mess... We can't distinguish the description from the
        // clause number in that case
        return (row) => {
            return {
                clause_number: undefined,
                // the description is in the column that it's header is not empty
                description: getFromArr(row, header.findIndex(cell => cell !== ''))
            };
        };
    }
    //description is the other column
    const descriptionIndex = clauseNumberIndex === 0 ? 1 : 0;

    return (row) => {
        return {
            clause_number: getFromArr(row, clauseNumberIndex),
            description: getFromArr(row, descriptionIndex)
        };
    };
};

const startChart6Predicate = (cell) => {
    return cell === 'הוראות נוספות6.';
};



const extractChartSix = (pageTables) => {
    return pageTablesToDataArray({pageTables,
        rowAbstractFactory,
        startOfChartPred: startChart6Predicate,
        offsetOfRowWithDataInChart: 0,  //the header is data too
        chartDonePredicate: (row) => row.some(cell => cell === 'ביצוע התכנית7.'),
        // table 6 will always start in a new page and it has no actual header beyond the title
        getHeaderRowIndex: (page, searchFrom) => {
            // these two cases (the if and the else) could have been merged, but the code on the else is more specific
            // for the case of the first page
            if (searchFrom === 0) {
                // not the first page
                return page.findIndex(row => row.some(cell => /^6.\d+/.exec(cell) !== null));
            }
            else {
                // the first page
                const ind = page.findIndex(row => row.some(cell => startChart6Predicate(cell)));
                return ind === -1 ? -1 : ind + 2;
            }

        },
        identifier: 'chart 6'
    });
};

// the input is chart 6 from the parser, the output is processed and grouped chart 6
const processChartSix = (chartSix) => {
    const processedChartSix = [];
    let curr_cat = '';
    let curr_cat_number = '';

    if (chartSix === undefined || chartSix.length === 0) {
        return [];
    }

    // if the data is damaged, the clause number is empty because it's in the description
    const is_data_damaged = chartSix[0].clause_number === '' || chartSix[0].clause_number === undefined;

    for (let i = 0; i < chartSix.length; i++) {
        const clause_num = chartSix[i].clause_number;
        const description = chartSix[i].description;

        // it's something like 4.1 or 4.3 (number dot number)
        const cat_match = is_data_damaged ? /(?<!\.)6\.\d+(?!\.)/.exec(description) : /^6\.\d+$/.exec(clause_num);
        if (cat_match !== null) {
            const prev_cat = curr_cat;
            const prev_cat_number = curr_cat_number;
            // it's a father category, but it's not saying anything, yet. we save it for later.
            if (!is_data_damaged) {
                curr_cat = description.trim();
                curr_cat_number = clause_num.trim();
            }
            else {
                // the data is a mess - we will extract the description and the clause_num
                curr_cat = description.replace(cat_match[0], '').trim();
                curr_cat_number = cat_match[0].trim();
            }

            // in a case that it's an empty category we should append it with no text
            if(prev_cat !== '' && curr_cat !== prev_cat &&
                ((processedChartSix.length > 0 && processedChartSix[processedChartSix.length - 1].category !== prev_cat) || processedChartSix.length === 0)) {
                const processedRow = {
                    category: prev_cat,
                    category_number: prev_cat_number,
                    text: ''
                };
                processedChartSix.push(processedRow);
            }
        }

        else if (description !== '' && description !== curr_cat) {   // if the description is the same as the category, we dont want to push it
            // it's not defining a category, it's actual data
            // it's data of a previous category - probably caused by new page split
            if ((clause_num === '' || clause_num === undefined) &&
                processedChartSix.length > 0 &&
                processedChartSix[processedChartSix.length - 1].category === curr_cat) {
                // add the current description to the previous entry with a newline
                processedChartSix[processedChartSix.length - 1].text += '\n' + description;
            }
            else {
                const processedRow = {
                    category: curr_cat,
                    category_number: curr_cat_number,
                    text: description
                };
                processedChartSix.push(processedRow);
            }
        }
    }
    return processedChartSix;
};

module.exports = {
    extractChartSix,
    processChartSix
};