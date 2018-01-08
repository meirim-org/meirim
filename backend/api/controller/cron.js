'use strict';
const Controller = require('../controller/controller');
const Router = require('express').Router();
const _ = require('lodash');
const Log = require('../service/log');
const iplanApi = require('../service/iplanApi');
const Alert = require('../model/alert');
const Plan = require('../model/plan');
const Email = require('../service/email');
const Bluebird = require('bluebird');
const Schedule = require('node-schedule');
const MavatAPI = require('../lib/mavat');
const Config = require('../service/config');

class CronController extends Controller {

  iplan(req, res, next) {
    Log.info('Running iplan fetcher');
    // returns a Promise that resolves to true if its a new plan, false otherwise
    const isNewPlan = (iPlan) => {
      return Plan.fetchByObjectID(iPlan.properties.OBJECTID).then((plan) => !plan);
    };
    // the server is limited to 1000 results, we we get these by fragements
    return iplanApi.getPlanningCouncils().then(councils => councils.features).mapSeries(council => {
      // Log.debug('Fetching', council.attributes.MT_Heb);
      return iplanApi.getBlueLines(`PLAN_AREA_CODE=${council.attributes.CodeMT}`).
          then(_.flatten).//we get array of arrays(since it seems there might be multiple features per plan).
          filter(isNewPlan).
          map(Plan.buildFromIPlan).
          map((plan) => [plan, MavatAPI.parseMavat(plan.attributes.plan_url)]).
          map(Bluebird.all). //waiting for getting everything
          map(_.spread(Plan.setMavatData)).
          map((plan) => plan.save());
    });
  }

  sendPlanningAlerts(req, res, next) {
    Log.info('Running send planning alert');
    return Plan.getUnsentPlans().then(unsentPlans => {
      Log.debug('Got', unsentPlans.models.length, 'Plans');
      return unsentPlans.models;
    }).mapSeries(unsentPlan => {
      return Alert.getUsersByGeometry(unsentPlan.get('id')).then(users => {
        Log.debug('Got', users.length, 'users for plan', unsentPlan.get('id'));
        if (!users || !users.length) {
          return {'plan_id': unsentPlan.get('id'), 'users': 0};
        }

        //reduce double users
        return Bluebird.mapSeries(users.models, user => Email.newPlanAlert(user, unsentPlan)).then(() => {
          return {'plan_id': unsentPlan.get('id'), 'users': users.length};
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

const controller = new CronController();
const scheduleConfig = Config.get('services.schedule');

// set up schedule tasks
if (scheduleConfig.iplan) {
  Schedule.scheduleJob(scheduleConfig.iplan, _.bind(controller.iplan, controller));
}
if (scheduleConfig.iplan) {
  Schedule.scheduleJob(scheduleConfig.sendPlanningAlerts, _.bind(controller.sendPlanningAlerts, controller));
}

Router.get('/iplan', (req, res, next) => {
  controller.wrap(_.bind(controller.iplan, controller))(req, res, next);
});
Router.get('/send_planning_alerts', (req, res, next) => {
  controller.wrap(_.bind(controller.sendPlanningAlerts, controller))(req, res, next);
});

module.exports = Router;
