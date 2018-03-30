const Controller = require('../controller/controller');
const Alert = require('../model/alert');
const Email = require('../service/email');
const Log = require('../lib/log');
const Exception = require('../model/exception');

class AlertController extends Controller {
  create(req, res, next) {
    return super.create(req, res, next)
      .then(savedAlert => Email.newAlert(req.session.person, savedAlert))
      .then(() => true);
  }

  /**
   * Return person's alerts. Must be logged in.
   * @param {IncomingRequest} req
   */
  browse(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    }
    return this.model
      .query('where', 'person_id', '=', req.session.person.id)
      .fetchAll()
      .then((collection) => {
        Log.debug(this.tableName, 'browse success user', req.session.person.id);
        return collection;
      });
  }
  /**
   * Unsubscribe from alert by token, when clicking an unsubscribe
   * link in an email
   * @param {IncomingRequest} req
   */
  unsubscribe(req) {
    return Alert
      .ByToken(req.query.token)
      .fetch()
      .then((fetchedModel) => {
        if (!fetchedModel) {
          throw new Exception.NotFound('Nof found');
        }
        Log.debug(this.tableName, 'unsubscribe success id:', fetchedModel.get('id'));
        return fetchedModel.destroy(req.body);
      });
  }
}

module.exports = new AlertController(Alert);
