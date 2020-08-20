const { pageTablesToDataArray } = require('./chartToArrayBuilder');


// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryChart181 = (firstPageOfTable) => {
    const getFromArr = (arr, index) => {
        return index === undefined || index === -1 ? undefined : arr[index];
    };

    //clean the headers
    firstPageOfTable = firstPageOfTable.map(row => row.map(cell => cell.replace(/\n/g, ' ')
        .replace(/ {2}/g, ' ')
        .trim()));

    const headersStartIndex = firstPageOfTable.findIndex(row => row.some(cell => cell.includes('סוג')) &&
        row.some(cell => cell.includes('שם')));
    if (headersStartIndex === -1) {
        console.log("didn't find headers");
        return (row => {});
    }

    const header = firstPageOfTable[headersStartIndex];

    const professionIndex = header.findIndex(title => title.includes('מקצוע'));
    const typeIndex = header.findIndex(title => title === 'סוג');
    const nameIndex = header.findIndex(title => title === 'שם');
    const licenseNumberIndex = header.findIndex(title => title === 'מספר רשיון');
    const corporateIndex = header.findIndex(title => title === 'שם תאגיד');
    const cityIndex = header.findIndex(title => title === 'ישוב');
    const streetIndex = header.findIndex(title => title === 'רחוב');
    const houseIndex = header.findIndex(title => title === 'בית');
    const phoneIndex = header.findIndex(title => title === 'טלפון');
    const faxIndex = header.findIndex(title => title === 'פקס');
    const emailIndex = header.findIndex(title => title === 'דוא"ל');

    return (row) => {
        return {
            profession: getFromArr(row, professionIndex),
            type: getFromArr(row, typeIndex),
            name: getFromArr(row, nameIndex),
            licenseNumber: getFromArr(row, licenseNumberIndex),
            corporate: getFromArr(row, corporateIndex),
            city: getFromArr(row, cityIndex),
            street: getFromArr(row, streetIndex),
            house: getFromArr(row, houseIndex),
            phone: getFromArr(row, phoneIndex),
            fax: getFromArr(row, faxIndex),
            email: getFromArr(row, emailIndex) !== undefined ? getFromArr(row, emailIndex).replace(/ /g, '') : undefined,
        }
    }
};

const endOfTable181Predicate = (row) => {
    return row.some(cell => cell === '1.8.2') || row.some(cell => cell.includes('הערה'));
};

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryChart182 = (firstPageOfTable) => {

};

const endOfTable182Predicate = (row) => {
    return row.some(cell => cell  === '1.8.3') || row[0].includes('(1)')  //watch this (1), it might be inaccurate
};

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryChart183 = (firstPageOfTable) => {

};

const endOfTable183Predicate = (row) => {
    return row.some(cell => cell === '1.8.4') || row[0].includes('(1)')  //watch this (1), it might be inaccurate
};

const dataRowPredicateFn = (row) => {
    return row.some(cell => cell !== '');
};


const extractCharts1Point8 = (pageTables) => {
    return {
        chart181: pageTablesToDataArray({
          pageTables,
          rowAbstractFactory: rowAbstractFactoryChart181,
          startOfChartPred: (cell) => cell === 'מגיש התכנית1.8.1',
          offsetOfRowWithDataInChart: 1,
          chartDonePredicate: endOfTable181Predicate,
          getHeaderRowIndex: (page) => page.findIndex(row => row.some(cell => cell.includes('סוג')) &&
              row.some(cell => cell.includes('שם'))),
          dataRowPredicateFn,
          identifier: '1.8.1'}),
    };
};


module.exports = {
    extractCharts1Point8
};