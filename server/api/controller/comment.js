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
				throw new Exception.BadRequest('Please provide an alias');
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

	async addLike (req) {
		if(!req.session.person) {
			throw new Exception.BadRequest('Must be logged in');
		}
		const { commentId } = req.body;
		const comment = await Comment.where({ id: commentId }).fetch();
		const { attributes: { likes } } = comment;
		return comment.save({ likes: likes + 1 });
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
