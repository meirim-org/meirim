const Controller = require('../controller/controller');
const QuestionComment = require('../model/question_comment');
const Exception = require('../model/exception');

class QuestionCommentController extends Controller {
  browse (req) {
    const columns = [
      'id',
      'question_id',
      'approved',
      'reviewed',
      'title',
      'description',
      'created_at'
    ];

    const { query } = req;

    // show only approved entities
    const where = { approved: true };

    if (query.question_id) {
      where.question_id = query.question_id;
    }

    const order = '-id';

    return super.browse(req, {
      columns,
      where,
      order
    });
  }

  create(req, res, next) {
    if (!req.session.person) {
      throw new Exception.BadRequest('Must be logged in');
    }

    // remove fields the user is not allowed to set
    delete req.body.approved;
    delete req.body.reviewed;
    delete req.body.created_at;
    delete req.body.updated_at;

    return super.create(req, res, next);
  }
}

module.exports = new QuestionCommentController(QuestionComment);
