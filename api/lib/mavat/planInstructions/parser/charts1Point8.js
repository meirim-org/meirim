const { pageTablesToDataArray } = require('./chartToArrayBuilder');


// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactoryCharts18 = (firstPageOfTable, headersStartIndex) => {
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

    const professionIndex = header.findIndex(title => title.includes('מקצוע'));
    const typeIndex = header.findIndex(title => title === 'סוג');
    const descriptionIndex = header.findIndex(title => title === 'תיאור');
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
        let shouldBeDescription = getFromArr(row, descriptionIndex);
        let shouldBeType = getFromArr(row, typeIndex);
        //to fix taba4 1.8.3 parsing test. type is less likely to be empty.
        if (shouldBeType === '' && shouldBeDescription !== '' && shouldBeDescription !== undefined) {
            shouldBeType = shouldBeDescription;
            shouldBeDescription = '';
        }
        return {
            profession: getFromArr(row, professionIndex),
            type: shouldBeType,
            description: shouldBeDescription,
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


const extractCharts1Point8 = (pageTables) => {
    return {
        chart181: pageTablesToDataArray({
          pageTables,
          rowAbstractFactory: rowAbstractFactoryCharts18,
          startOfChartPred: (cell) => cell === 'מגיש התכנית1.8.1',
          offsetOfRowWithDataInChart: 1,
          chartDonePredicate: (row) => row.some(cell => cell.includes('1.8.2') || row.some(cell => cell.includes('הערה'))),
          getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('סוג')) &&
              row.some(cell => cell.includes('שם'))) + searchFrom,
          identifier: '1.8.1'}),
        chart182: pageTablesToDataArray({
           pageTables,
           rowAbstractFactory: rowAbstractFactoryCharts18,
           startOfChartPred: (cell) => cell.includes('1.8.2'),
           offsetOfRowWithDataInChart: 1,
           chartDonePredicate: (row) => row.some(cell => cell.includes('1.8.3' || cell.includes('כתובת:'))),
           getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('סוג')) &&
               row.some(cell => cell.includes('שם'))) + searchFrom,
           identifier: '1.8.2'}),
        chart183: pageTablesToDataArray({
            pageTables,
            rowAbstractFactory: rowAbstractFactoryCharts18,
            startOfChartPred: (cell) => cell.includes('1.8.3') && !cell.includes('1.8.4'),
            offsetOfRowWithDataInChart: 1,
            chartDonePredicate: (row) => row.some(cell => cell.includes('1.8.4') || cell.includes('כתובת:')),
            getHeaderRowIndex: (page, searchFrom) => page.slice(searchFrom).findIndex(row => row.some(cell => cell.includes('סוג')) &&
                row.some(cell => cell.includes('שם'))) + searchFrom,
            identifier: '1.8.3'})
    };
};


module.exports = {
    extractCharts1Point8
};