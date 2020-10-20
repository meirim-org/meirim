const Controller = require('../controller/controller');
const { Notification } = require('../model');

class NotificationController extends Controller {
}

module.exports = new NotificationController(Notification);
