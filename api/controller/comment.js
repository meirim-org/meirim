const Controller = require('../controller/controller');
const Comment = require('../model/comment');
const Person = require('../model/person');
const Log = require('../lib/log');
const Exception = require('../model/exception');

class CommentController extends Controller {
  create(req, res, next) {
    if (!req.session.person) {
      throw new Exception.BadRequest('Must be logged in');
    }

    // add fname
    let alias = Promise.resolve();
    if (!req.session.person.alias) {
      if (!req.body.alias) {
        throw new Exception.BadRequest('Please provide an alias');
      }
      const aliasString = req.body.alias;
      alias = Person.forge({
        id: req.session.person.id,
      })
        .fetch()
        .then(person => person.save({ alias: aliasString }, { patch: true }))
        .then((person) => {
          req.session.person = person;
          return false;
        });
    }
    // this will throw an error when creating a comment
    delete req.body.alias;

    return Promise.all([alias, super.create(req, res, next)]).then(
      result => result[1],
    );
  }

  /**
   * Return person's alerts. Must be logged in.
   * @param {IncomingRequest} req
   */
  byPlan(req) {
    return this.model.byPlan(req.params.plan_id).then((collection) => {
      Log.debug(this.tableName, 'Get comment list', req.params.plan_id);
      return collection;
    });
  }

  byPlanAdmin(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    } else if (!req.session.person.admin) {
      throw new Exception.NotAllowed('Must be an admin');
    }

    return this.model.byPlan(req.params.plan_id).then((collection) => {
      Log.debug(this.tableName, 'Get comment list', req.params.plan_id);
      return {
        id: req.params.plan_id,
        comment_total: collection.length,
        comments: collection
      };
    });
  }

  browseAdmin(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    } else if (!req.session.person.admin) {
      throw new Exception.NotAllowed('Must be an admin');
    }

    const columns = [
        "id",
        "person_id",
        "content",
        "plan_id",
        "parent_id"
    ];

    const { query } = req;
    const where = {};

    const order = query.order || '-id';

    return super.browse(req, {
        columns,
        where,
        order
    });
  }
}

module.exports = new CommentController(Comment);
