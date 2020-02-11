//TODO - for now this is just a copy of the chartFive - need to adjust and test this
const { pageTablesToDataArray } = require('./chartToArrayBuilder');

const rowFactory = (row) => {
  return {
    designation: row[11],
    use: row[10],
    areaNumbers: row[9],
    fieldSizeSm: row[8],
    abovePrimary: {
      main: row[7],
      service: row[6]
    },
    belowPrimary: {
      main: row[5],
      service: row[4]
    },
    tahsit:row[3],
    numOfUnits:row[2],
    floors: {
      above: row[1],
      below: row[0]
    }
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