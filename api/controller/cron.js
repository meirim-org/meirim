const Log = require('../lib/log');
const iplanApi = require('../lib/iplanApi');
const Alert = require('../model/alert');
const Plan = require('../model/plan');
const Email = require('../service/email');
const Bluebird = require('bluebird');
const MavatAPI = require('../lib/mavat');
const { fetchStaticMap } = require('../service/staticmap');

// const isNewPlan = iPlan => Plan
//   .fetchByObjectID(iPlan.properties.OBJECTID)
//   .then(plan => !plan);

module.exports = {
  iplan: () => {
    return iplanApi
      .getBlueLines()
      .then((iPlans) => {
        // loop over plans received
        // console.log(iPlans[0].properties);
        return Bluebird.mapSeries(iPlans, iPlan =>
          
          Plan.forge({
            PL_NUMBER: iPlan.properties.PL_NUMBER,
          })
            .fetch()
            .then((oldPlan) => {
              // check if there was an update
              if (oldPlan && oldPlan.get('data').LAST_UPDATE === iPlan.properties.LAST_UPDATE) {
                // Log.debug('No update required');
                return Bluebird.resolve();
              }
              // if there was an update get more data and save
              return Plan
                .buildFromIPlan(iPlan, oldPlan)
                .then(plan => MavatAPI
                  .parseMavat(plan.get('plan_url'))
                  .then((mavatData) => {
                    Plan.setMavatData(plan, mavatData);
                    if (!oldPlan || oldPlan.get('data').STATION !== iPlan.properties.STATION) {
                      plan.set('sent', oldPlan ? 1 : 0);
                    }
                    // Log.debug('Saving with mavat', JSON.stringify(mavatData));
                    return plan.save();
                  })
                  .catch((e) => {
                    console.log('Saving without mavat', JSON.stringify(e));
                    return plan.save();
                  }));
            })
            .catch((e) => {
              console.log('iplan exception', JSON.stringify(e));
              return Bluebird.resolve();
            }));
      });
  },

  complete_mavat_data: () => {
    return Plan.query((qb) => {
        qb.where('main_details_from_mavat', '=', '');
      })
      .fetchAll()
      .then(planCollection => {
        return Bluebird.mapSeries(planCollection.models, plan => {
          Log.debug((plan.get('plan_url')));
          return MavatAPI
            .parseMavat(plan.get('plan_url'))
            .then((mavatData) => {
              Plan.setMavatData(plan, mavatData);
              Log.debug('Saving with mavat', JSON.stringify(mavatData));
              return plan.save();
            });
        })
      });
  },

  complete_jurisdiction_from_mavat: () => {
    return Plan.query((qb) => {
        qb.where('jurisdiction', 'IS', null);
      })
      .fetchAll()
      .then(planCollection => {
        return Bluebird.mapSeries(planCollection.models, plan => {
          Log.debug((plan.get('plan_url')));
          return MavatAPI
            .parseMavat(plan.get('plan_url'))
            .then((mavatData) => {
              Plan.setMavatData(plan, mavatData);
              Log.debug('Saving with jurisdiction form mavat', JSON.stringify(mavatData));
              return plan.save();
            });
        })
      });
  },

  sendPlanningAlerts: () => {
    // send emails for each plan to each user in the geographic area the fits
    // sendPlanningAlerts(req, res, next) {id
    Log.info('Running send planning alert');

    return Plan
      .getUnsentPlans({
        limit: 1,
      })
      .then((unsentPlans) => {
        Log.debug('Got', unsentPlans.models.length, 'Plans');
        return unsentPlans.models;
      })
      .mapSeries((unsentPlan) => {
        return Promise.all([
          Alert.getUsersByGeometry(unsentPlan.get('id')),
          fetchStaticMap(unsentPlan.get('lat'), unsentPlan.get('lon')),
        ]).then(([users, planStaticMap]) => {
            Log.debug('Got', users[0].length, 'users for plan', unsentPlan.get('id'));

            if (!users[0] || !users[0].length) {
              return {
                plan_id: unsentPlan.get('id'),
                users: 0,
              };
            }
            return Bluebird
            .mapSeries(users[0], user => Email.newPlanAlert(user, unsentPlan, planStaticMap))
            .then(() => {
              return {
                plan_id: unsentPlan.get('id'),
                users: users.length,
              };
            });
          });
      })
      .then((successArray) => {
        const idArray = [];
        successArray.reduce((pv, cv) => idArray.push(cv.plan_id), 0);
        if (idArray.length) {
          return Plan.maekPlansAsSent(idArray)
            .then(() => Log.info('Processed plans', idArray));
        }
        return true;
        // return successArray.reduce((pv, cv) => pv.users + cv.users, 0);
      });
  },
};