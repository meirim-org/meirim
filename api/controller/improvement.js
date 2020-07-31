const Controller = require('../controller/controller');
const Improvement = require('../model/improvement');
const Log = require('../lib/log');
const Exception = require('../model/exception');

class ImprovementController extends Controller {
  create(req, res, next) {
    if (!req.session.person) {
      throw new Exception.BadRequest('Must be logged in');
    }

    // add participation_id to body so we don't need to send it twice
    // (once as part of the url and another as part of the body)
    req.body.participation_id = req.params.participation_id

    return super.create(req, res, next);
  }

  /**
   * Return participation's improvements.
   * @param {IncomingRequest} req
   */
  byParticipation(req) {
    return this.model.byParticipation(req.params.participation_id).then((collection) => {
      Log.debug(this.tableName, 'Get improvement list', req.params.participation_id);
      return collection;
    });
  }
}

module.exports = new ImprovementController(Improvement);
