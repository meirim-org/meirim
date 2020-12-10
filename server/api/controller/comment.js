const Controller = require('../controller/controller');
const Comment = require('../model/comment');
const Person = require('../model/person');
const Log = require('../lib/log');
const Exception = require('../model/exception');

class CommentController extends Controller {
	create (req, res, next) {
		if (!req.session.person) {
			throw new Exception.BadRequest('Must be logged in');
		}

		// add fname
		let alias = Promise.resolve();
		if (!req.session.person.name) {
			if (!req.body.name) {
				throw new Exception.BadRequest('Please provide person name');
			}
			const aliasString = req.body.name;
			alias = Person.forge({
				id: req.session.person.id
			})
				.fetch()
				.then(person => person.save({ name: aliasString }, { patch: true }))
				.then((person) => {
					req.session.person = person;
					return false;
				});
		}
		// this will throw an error when creating a comment
		delete req.body.name;

		return Promise.all([alias, super.create(req, res, next)]).then(
			result => result[1]
		);
	}

	/**
   * Return person's alerts. Must be logged in.
   * @param {IncomingRequest} req
   */
	byPlan (req) {
		return this.model.byPlan(req.params.plan_id).then((collection) => {
			Log.debug(this.tableName, 'Get comment list', req.params.plan_id);
			return collection;
		});
	}
}

module.exports = new CommentController(Comment);
