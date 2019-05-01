const Bluebird = require('bluebird');
const Log = require('../lib/log');
const iplanApi = require('../lib/iplanApi');
const Alert = require('../model/alert');
const Plan = require('../model/plan');
const Email = require('../service/email');
const MavatAPI = require('../lib/mavat');
const { fetchStaticMap } = require('../service/staticmap');
const Turf = require('turf');

// const isNewPlan = iPlan => Plan
//   .fetchByObjectID(iPlan.properties.OBJECTID)
//   .then(plan => !plan);

module.exports = {
  iplan: () =>
    iplanApi
      .getBlueLines()
      .then(iPlans => Bluebird.mapSeries(iPlans, iPlan => fetchIplan(iPlan))),

  complete_mavat_data: () =>
    Plan.query(qb => {
      qb.where('main_details_from_mavat', '=', '');
    })
      .fetchAll()
      .then(planCollection =>
        Bluebird.mapSeries(planCollection.models, plan => {
          Log.debug(plan.get('plan_url'));

          return MavatAPI.parseMavat(plan.get('plan_url')).then(mavatData => {
            Plan.setMavatData(plan, mavatData);
            Log.debug('Saving with mavat', JSON.stringify(mavatData));
            return plan.save();
          });
        })
      ),

  complete_jurisdiction_from_mavat: () =>
    Plan.query(qb => {
      qb.where('jurisdiction', 'IS', null);
    })
      .fetchAll()
      .then(planCollection =>
        Bluebird.mapSeries(planCollection.models, plan => {
          Log.debug(plan.get('plan_url'));
          return MavatAPI.parseMavat(plan.get('plan_url')).then(mavatData => {
            Plan.setMavatData(plan, mavatData);
            Log.debug(
              'Saving with jurisdiction form mavat',
              JSON.stringify(mavatData)
            );
            return plan.save();
          });
        })
      ),

  sendPlanningAlerts: () => {
    // send emails for each plan to each user in the geographic area the fits
    // sendPlanningAlerts(req, res, next) {id
    Log.info('Running send planning alert');

    return Plan.getUnsentPlans({
      limit: 1
    })
      .then(unsentPlans => {
        Log.debug('Got', unsentPlans.models.length, 'Plans');
        return unsentPlans.models;
      })
      .mapSeries(unsentPlan => {
        const centroid = Turf.centroid(unsentPlan.get('geom'));
        return Promise.all([
          Alert.getUsersByGeometry(unsentPlan.get('id')),
          fetchStaticMap(
            centroid.geometry.coordinates[1],
            centroid.geometry.coordinates[0]
          )
        ]).then(([users, planStaticMap]) => {
          Log.debug(
            'Got',
            users[0].length,
            'users for plan',
            unsentPlan.get('id')
          );

          if (!users[0] || !users[0].length) {
            return {
              plan_id: unsentPlan.get('id'),
              users: 0
            };
          }
          return Bluebird.mapSeries(users[0], user =>
            Email.newPlanAlert(user, unsentPlan, planStaticMap)
          ).then(() => ({
            plan_id: unsentPlan.get('id'),
            users: users.length
          }));
        });
      })
      .then(successArray => {
        const idArray = [];
        successArray.reduce((pv, cv) => idArray.push(cv.plan_id), 0);
        if (idArray.length) {
          return Plan.maekPlansAsSent(idArray).then(() =>
            Log.info('Processed plans', idArray)
          );
        }
        return true;
        // return successArray.reduce((pv, cv) => pv.users + cv.users, 0);
      });
  }
};

/** Private */

const fetchIplan = iPlan =>
  Plan.forge({
    PL_NUMBER: iPlan.properties.PL_NUMBER
  })
    .fetch()
    .then(oldPlan => {
      // check if there was an update
      if (
        oldPlan &&
        oldPlan.get('data').LAST_UPDATE === iPlan.properties.LAST_UPDATE
      ) {
        // Log.debug('No update required');
        return Bluebird.resolve();
      }

      return (
        buildPlan(iPlan, oldPlan)
          // check if there is an update in the status of the plan and mark it for email update
          .then(plan => {
            if (
              !oldPlan ||
              oldPlan.get('data').STATION !== iPlan.properties.STATION
            ) {
              plan.set('sent', oldPlan ? 1 : 0);
            }
            return plan;
          })
      );
    })
    .then(plan => plan.save())
    .catch(e => {
      console.log('iplan exception', JSON.stringify(e));
      return Bluebird.resolve();
    });

const buildPlan = (iPlan, oldPlan) =>
  Plan.buildFromIPlan(iPlan, oldPlan).then(plan => {
    // no mavat url was found
    if (!plan.get('plan_url')) {
      return plan;
    }

    return MavatAPI.parseMavat(plan.get('plan_url'))
      .then(mavatData => Plan.setMavatData(plan, mavatData))
      .catch(e => {
        // mavat might crash gracefully
        console.log('Mavat error', JSON.stringify(e));
        return plan;
      });
  });
