const extractPlanInformation = (pageTables) => {
  const startOfExplenationText = 'דברי הסבר לתכנית';
  let text = ''
  for (let i = 0; i < pageTables.length; i++){
    if (pageTables[i].tables[0][0] === startOfExplenationText){
      text = pageTables[i].tables[1][0];
      break;
    }
  }
  return text;
};

module.exports = {
  extractPlanInformation
};