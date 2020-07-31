const Controller = require('../controller/controller');
const ImprovementComment = require('../model/improvement_comment');
const Log = require('../lib/log');
const Exception = require('../model/exception');

class ImprovementCommentController extends Controller {
  create(req, res, next) {
    if (!req.session.person) {
      throw new Exception.BadRequest('Must be logged in');
    }

    // add improvement_id to body so we don't need to send it twice
    // (once as part of the url and another as part of the body)
    req.body.improvement_id = req.params.improvement_id

    return super.create(req, res, next);
  }

  /**
   * Return improvement's comments.
   * @param {IncomingRequest} req
   */
  byImprovement(req) {
    return this.model.byImprovement(req.params.improvement_id).then((collection) => {
      Log.debug(this.tableName, 'Get improvement comment list', req.params.improvement_id);
      return collection;
    });
  }
}

module.exports = new ImprovementCommentController(ImprovementComment);
