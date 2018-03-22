const Schedule = require('node-schedule');
const Config = require('./service/config');

const scheduleConfig = Config.get('services.schedule');

// set up schedule tasks
if (scheduleConfig.iplan) {
  Schedule.scheduleJob(scheduleConfig.iplan, _.bind(controller.iplan, controller));
}
if (scheduleConfig.iplan) {
  Schedule.scheduleJob(scheduleConfig.sendPlanningAlerts, _.bind(controller.sendPlanningAlerts, controller));
}