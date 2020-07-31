const Controller = require('../controller/controller');
const QuestionComment = require('../model/question_comment');
const Log = require('../lib/log');
const Exception = require('../model/exception');

class QuestionCommentController extends Controller {
  create(req, res, next) {
    if (!req.session.person) {
      throw new Exception.BadRequest('Must be logged in');
    }

    // add question_id to body so we don't need to send it twice
    // (once as part of the url and another as part of the body)
    req.body.question_id = req.params.question_id

    return super.create(req, res, next);
  }

  /**
   * Return question's comments.
   * @param {IncomingRequest} req
   */
  byQuestion(req) {
    return this.model.byQuestion(req.params.question_id).then((collection) => {
      Log.debug(this.tableName, 'Get question comment list', req.params.question_id);
      return collection;
    });
  }
}

module.exports = new QuestionCommentController(QuestionComment);
