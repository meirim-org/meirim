const Controller = require('../controller/controller');
const _ = require('lodash');
const Log = require('../lib/log');
const iplanApi = require('../lib/iplanApi');
const Alert = require('../model/alert');
const Plan = require('../model/plan');
const Email = require('../service/email');
const Bluebird = require('bluebird');
const MavatAPI = require('../lib/mavat');

class CronController extends Controller {

  static iplan() {
    Log.info('Running iplan fetcher');

    const isNewPlan = iPlan => Plan
      .fetchByObjectID(iPlan.properties.OBJECTID)
      .then(plan => !plan);


    return iplanApi.getPlanningCouncils()
      .then(councils => councils.features)
      .mapSeries(council => iplanApi.getBlueLines(`PLAN_AREA_CODE=${council.attributes.CodeMT}`)
        .then((plans) => {
          return Bluebird.map(plans, iPlan => Plan
            .fetchByObjectID(iPlan.properties.OBJECTID)
            .then(plan => (!plan ? iPlan : false)))
        })
        .then((iPlans) => {
          console.log(JSON.stringify(_.flatten(iPlans)));
          return iPlans.map(Plan.buildFromIPlan);

        })
        .mapSeries(plan => Bluebird.mapSeries([plan, MavatAPI.parseMavat(plan.attributes.plan_url)]))
        .then(all => {
          console.log(all)
        })
      );
    // returns a Promise that resolves to true if its a new plan, false otherwise
    // const isNewPlan = iPlan => Plan
    //   .fetchByObjectID(iPlan.properties.OBJECTID)
    //   .then(plan => !plan);


    // the server is limited to 1000 results, we we get these by fragements
    // return iplanApi
    //   .getPlanningCouncils()
    //   .then(councils => councils.features)
    //   .mapSeries(council => iplanApi
    //     .getBlueLines(`PLAN_AREA_CODE=${council.attributes.CodeMT}`)
    //     .then(_.flatten)
    //     // we get array of arrays(since it seems there might be multiple features per plan).
    //     .filter(isNewPlan)
    //     // update plans
    //     .map(Plan.buildFromIPlan)
    //     .mapSeries(plan => Bluebird.all([plan, MavatAPI.parseMavat(plan.attributes.plan_url)]))
    //     // map(Bluebird.all). //waiting for getting everything
    //     .map(_.spread(Plan.setMavatData))
    //     .map(plan => Plan.fetchByObjectID(plan.get('OBJECTID'))
    //       .then((oldPlan) => {
    //         if (oldPlan) {
    //           Log.debug(oldPlan.get('data'), plan.get('data'));

    //           let updatedProps = plan.toJSON();
    //           updatedProps.sent = 1;
    //           Log.debug('Updated plan', plan.get('OBJECTID'));
    //           return oldPlan.save(updatedProps);
    //         }
    //         Log.debug('New plan', plan.get('OBJECTID'));
    //         return plan.save();
    //       })
    //     )
    //   )
  }

  static sendPlanningAlerts() {
    // send emails for each plan to each user in the geographic area the fits
    // sendPlanningAlerts(req, res, next) {
    Log.info('Running send planning alert');
    return Plan.getUnsentPlans().then(unsentPlans => {
      Log.debug('Got', unsentPlans.models.length, 'Plans');
      return unsentPlans.models;
    }).mapSeries(unsentPlan => {
      return Alert.getUsersByGeometry(unsentPlan.get('id')).then(users => {

        Log.debug('Got', users.length, 'users for plan', unsentPlan.get('id'));

        if (!users || !users.length) {
          return {
            'plan_id': unsentPlan.get('id'),
            'users': 0
          };
        }

        //reduce double users
        return Bluebird.mapSeries(users[0], user => Email.newPlanAlert(user))
          .then(() => {
            return {
              'plan_id': unsentPlan.get('id'),
              'users': users.length
            };
          });
      });
    }).then(successArray => {
      let id_array = [];
      successArray.reduce((pv, cv) => id_array.push(cv.plan_id), 0);
      if (id_array.length) {
        Plan.maekPlansAsSent(id_array);
        Log.info('Processed', id_array);
      }
      return successArray.reduce((pv, cv) => pv.users + cv.users, 0);
    });
  }
}


module.exports = CronController;