const Router = require('express').Router();

const Log = require('./lib/log');
const Plan = require('./model/plan');
const config = require('../src/config.json');

// all plan pages should render opengraph tags
Router.get(['/plan/:planId', '/plan/:planId/*'], function(req, res, next) {
  const { planId } = req.params;

  // fetch plan details to populate opengraph tags
  Plan.fetchByPlanID(planId)
    .then(plan => {
      let pageDescription;

      // some plans don't have depositing dates
      if (plan.attributes.data.DEPOSITING_DATE)
        pageDescription = `תב"ע ב${plan.attributes.data.PLAN_COUNTY_NAME} אשר הופקדה ב ${dateStrFormat(plan.attributes.data.DEPOSITING_DATE)}`;
      else
        pageDescription = `תב"ע ב${plan.attributes.data.PLAN_COUNTY_NAME}`;

      res.render('index', {
        layout: false, 
        pageTitle: `${plan.attributes.PL_NUMBER} - ${plan.attributes.PL_NAME} - מעירים`, 
        pageDescription: pageDescription,
        pageImage: `${req.protocol}://${req.get('host')}/favicon.ico`,
      });
    }).catch(error => {
      Log.error('failed to fetch plan details for opengraph');
      Log.error(error);

      res.render('index', {
        layout: false, 
        pageTitle: 'תוכנית בניה - מעירים', 
        pageDescription: '',
        pageImage: `${req.protocol}://${req.get('host')}/favicon.ico`,
      });
    });
});
  
// all non-plan pages have static opengraph tag values
Router.get('*', function(req, res, next) {
  res.render('index', {
    layout: false, 
    pageTitle: 'מעירים - מידע תכנוני ואקטיביזם עירוני', 
    pageDescription: 'רוצים לדעת אם הגינה הציבורית שלכם עומדת להפוך למגדל?',
    pageImage: `${req.protocol}://${req.get('host')}/favicon.ico`,
  });
});

/**
 * Convert date object to string with "dd/MM/yyyy" format.
 */

function dateStrFormat(dateStr) {
  try {
    const dt = new Date(dateStr);
    const day = dt.getDate();
    const month = dt.getMonth < 9 ? `0${dt.getMonth() + 1}` : dt.getMonth() + 1;
    const year = dt.getFullYear();
  
    return `${day}/${month}/${year}`;
  } catch (err) {
    Log.error('bad datetime: ', err);
    return dateStr;
  }
}

module.exports = Router;
