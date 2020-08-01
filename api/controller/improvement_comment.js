const Controller = require('../controller/controller');
const ImprovementComment = require('../model/improvement_comment');
const Exception = require('../model/exception');

class ImprovementCommentController extends Controller {
  browse (req) {
    const columns = [
      'id',
      'improvement_id',
      'approved',
      'reviewed',
      'title',
      'description',
      'created_at'
    ];

    const { query } = req;

    // show only approved entities
    const where = { approved: true };

    if (query.improvement_id) {
      where.improvement_id = query.improvement_id;
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

module.exports = new ImprovementCommentController(ImprovementComment);
