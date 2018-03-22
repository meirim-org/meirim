const Express = require('express');
const Controller = require('./controller/controller');
const _ = require('lodash');
const signUp = require('./controller/sign');
const activity = require('./controller/activity');
const password = require('./controller/password');
const alert = require('./controller/alert');
const cron = require('./controller/cron');
const tag = require('./controller/tag');
const status = require('./controller/status');
const health = require('./controller/health');

const Router = Express.Router();


app.use('/health', json, urlencoded, require('./api/routes/health'));

// Sign up
Router.post('/sign/up', Controller.wrap(_.bind(signUp.signup, signUp)));
Router.post('/sign/activate', Controller.wrap(_.bind(signUp.activate, signUp)));
Router.post('/sign/in', Controller.wrap(_.bind(signUp.signin, signUp)));
Router.post('/sign/out', Controller.wrap(_.bind(signUp.signout, signUp)));

// Activity
Router.get('/activity/', Controller.wrap(_.bind(activity.browse, activity)));
Router.post('/activity/', Controller.wrap(_.bind(activity.create, activity)));
Router.get('/activity/:id', Controller.wrap(_.bind(activity.read, activity)));
Router.post('/activity/:id/join', Controller.wrap(_.bind(activity.join, activity)));

// Password
Router.post('/password/sendResetToken',Controller.wrap(_.bind(password.sendResetToken, password)));
Router.post('/password/resetWithToken', Controller.wrap(_.bind(password.resetWithToken, password)));

// Alert
Router.get('/alert/', Controller.wrap(_.bind(alert.browse, alert)));
Router.get('/alert/:id', Controller.wrap(_.bind(alert.read, alert)));
Router.post('/alert/', Controller.wrap(_.bind(alert.create, alert)));
Router.delete('/alert/:id', Controller.wrap(_.bind(alert.delete, alert)));

// Cron
Router.get('/cron/iplan', controller.wrap(_.bind(controller.iplan, controller)));
Router.get('/cron/send_planning_alerts', controller.wrap(_.bind(controller.sendPlanningAlerts, controller)));

// Tag
Router.get('/tag/', controller.wrap(_.bind(controller.browse, controller)));

// Status
Router.get('/', controller.wrap(_.bind(controller.browse, controller)));

// Health
Router.get('/', controller.wrap(()=>""));

module.exports = Router;
