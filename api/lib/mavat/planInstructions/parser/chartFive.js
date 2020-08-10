const { pageTablesToDataArray } = require('./chartToArrayBuilder');

//TODO: ADD -1 checks in rowAbstractFactory

// this function look for the correct columns for the given headers, and returns a factory embedded with these findings
const rowAbstractFactory = (firstPageOfTable) => {

  const insideHeader = (currIndex, indexOfHeaderToBeInside, indexOfHeaderToTheRight) => {
    return currIndex >= indexOfHeaderToBeInside && currIndex < indexOfHeaderToTheRight;
  };

  const getFromArr = (arr, index) => {
    return index === undefined || index === -1 ? undefined : arr[index];
  };

  //clean the headers
  firstPageOfTable = firstPageOfTable.map(row => row.map(cell => cell.replace(/\n/g, ' ')
                                                                      .replace(/ {2}/g, ' ')
                                                                      .trim()));
  const headersStartIndex = firstPageOfTable.findIndex(row => row.some(cell => cell.includes('קו בנין')) &&
                                                              row.some(cell => cell.includes('מספר קומות')) &&
                                                              row.some(cell => cell.includes('%')));
  if (headersStartIndex === -1) {
      console.log("didn't find headers");
      return (row => {});
  }
  const headers = firstPageOfTable.slice(headersStartIndex, headersStartIndex + 3);

  const header0 = headers[0];
  const header1 = headers[1];
  const header2 = headers[2];

  const designationIndex = header0.findIndex(title => title === 'יעוד');
  const useIndex = header0.findIndex(title => title === 'שימוש');
  const areaNumberIndex = header0.findIndex(title => title === 'תאי שטח');
  const locationIndex = header0.findIndex(title => title.includes('מקום') && title.includes('בניין'));
  const fieldSizeSqmIndex = header0.findIndex(title => title.includes('גודל מגרש'));
  const buildingAreasIndex = header0.findIndex(title => title.includes('שטחי בניה'));
  const tahsitIndex = header0.findIndex(title => title.includes('%'));
  const numOfHousingUnitsIndex = header0.findIndex(title => title.includes('מספר יח"ד'));
  const heightIndex = header0.findIndex(title => title.includes('גובה'));
  const floorNumberIndex = header0.findIndex(title => title === 'מספר קומות');

  const frontBuildingLineIndex = header1.findIndex(title => title === 'קדמי');
  const backBuildingLineIndex = header1.findIndex(title => title === 'אחורי');
  const sideLeftBuildingLineIndex = header1.findIndex(title => title.includes('צידי') && title.includes('שמאלי'));
  const sideRightBuildingLineIndex = header1.findIndex(title => title.includes('צידי') && title.includes('ימני'));
  const floorsBelowEntranceIndex = header1.findIndex((title, index) => title === 'מתחת לכניסה הקובעת' &&
      insideHeader(index, floorNumberIndex, heightIndex));
  const floorsAboveEntranceIndex = header1.findIndex((title, index) => title === 'מעל הכניסה הקובעת' &&
      insideHeader(index, floorNumberIndex, heightIndex));
  const overallBuildingLandIndex = header1.findIndex(title => title === 'סה"כ שטחי בניה');
  const buildingAboveEntranceIndex = header1.findIndex((title, index) => title === 'מעל הכניסה הקובעת' &&
      insideHeader(index, buildingAreasIndex, fieldSizeSqmIndex));
  const buildingBelowEntranceIndex = header1.findIndex((title, index) => title === 'מתחת לכניסה הקובעת' &&
      insideHeader(index, buildingAreasIndex, fieldSizeSqmIndex));

  const buildingAboveEntranceMainIndex = header2.findIndex((title, index) => title === 'עיקרי' &&
      insideHeader(index, buildingAboveEntranceIndex, fieldSizeSqmIndex));
  const buildingAboveEntranceServiceIndex = header2.findIndex((title, index) => title === 'שרות' &&
      insideHeader(index, buildingAboveEntranceIndex, fieldSizeSqmIndex));
  const buildingBelowEntranceMainIndex = header2.findIndex((title, index) => title === 'עיקרי' &&
      insideHeader(index, buildingBelowEntranceIndex, buildingAboveEntranceIndex));
  const buildingBelowEntranceServiceIndex = header2.findIndex((title, index) => title === 'שרות' &&
      insideHeader(index, buildingBelowEntranceIndex, buildingAboveEntranceIndex));

  return (row) => {
    return {
      designation: getFromArr(row, designationIndex),
      use: getFromArr(row, useIndex),
      areaNumber: getFromArr(row, areaNumberIndex),
      location: getFromArr(row, locationIndex),
      fieldSizeSqm: getFromArr(row, fieldSizeSqmIndex),
      abovePrimaryMain: getFromArr(row, buildingAboveEntranceMainIndex),
      abovePrimaryService: getFromArr(row, buildingAboveEntranceServiceIndex),
      belowPrimaryMain: getFromArr(row, buildingBelowEntranceMainIndex),
      belowPrimaryService: getFromArr(row, buildingBelowEntranceServiceIndex),
      tahsit: getFromArr(row, tahsitIndex),
      numOfHousingUnits: getFromArr(row, numOfHousingUnitsIndex),
      floorsAbove: getFromArr(row, floorsAboveEntranceIndex),
      floorsBelow: getFromArr(row, floorsBelowEntranceIndex),
      overallBuildingLand: getFromArr(row, overallBuildingLandIndex),
      heightAboveEntrance: getFromArr(row, heightIndex),
      sideLineRight: getFromArr(row, sideRightBuildingLineIndex),
      sideLineLeft: getFromArr(row, sideLeftBuildingLineIndex),
      sideLineBack: getFromArr(row, backBuildingLineIndex),
      sideLineFront: getFromArr(row, frontBuildingLineIndex)
    }
  }
};

const dataRowPredicateFn = (row) => {
  const DESIGNATION_COL = 11;
  return !!row[DESIGNATION_COL]
};

const extractChartFive = (pageTables) => {

  return pageTablesToDataArray({pageTables,
    rowAbstractFactory,
    startOfChartText:'טבלת זכויות והוראות בניה - מצב מוצע5.',
    startRowOfChartFirstPage:6,
    continuationChartText:'מספר קומות',
    startIndexOfChartContinuatingPage: 4,
    chartDoneLine:  `האמור בטבלה זו גובר, במקרה של סתירה, על הוראות כלליות אחרות, בין בהוראות התכנית ובין בתשריט המצב המוצע.
גם בטבלה עצמה גוברת הוראה מפורטת על הוראה כללית
שטחי הבניה המפורטים בטבלה שלעיל כוללים את כל שטחי הבניה המירביים בתכנית זו`,
    dataRowPredicateFn});
};

module.exports = {
  extractChartFive
};