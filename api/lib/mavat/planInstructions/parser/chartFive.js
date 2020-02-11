const { pageTablesToDataArray } = require('./chartToArrayBuilder');

const rowFactory = (row) => {
  return {
    designation: row[11],
    use: row[10],
    areaNumber: row[9],
    fieldSizeSqm: row[8],
    abovePrimaryMain: row[7],
    abovePrimaryService: row[6],
    belowPrimaryMain: row[5],
    belowPrimaryService: row[4],
    tahsit:row[3],
    numOfHousingUnits:row[2],
    floorsAbove: row[1],
    floorsBelow: row[0]
  }
};

const dataRowPredicateFn = (row) => {
  const DESIGNATION_COL = 11;
  return !!row[DESIGNATION_COL]
};

const extractChartFive = (pageTables) => {

  return pageTablesToDataArray({pageTables,
    rowFactory,
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