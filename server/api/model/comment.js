const Checkit = require('checkit');
const Model = require('./base_model');
const Person = require('./person');
const Exception = require('./exception');

class Comment extends Model {
	get rules () {
		return {
			person_id: ['required', 'integer'],
			content: ['required', 'string'],
			type: ['string', function(val) {
				const validTypes = ['improvement', 'review', 'general'];
				if(validTypes.indexOf(val) < 0) return false;
				return true;
			}],
			likes: 'integer',
			plan_id: ['required', 'integer'],
			parent_id: 'integer',
		};
	}

	get hasTimestamps() {
		return true;
	}

	get tableName () {
		return 'comment';
	}

	person () {
		return this.belongsTo(Person);
	}

	initialize () {
		this.on('saving', this._saving, this);
		super.initialize();
	}

	_saving (model) {
		return new Checkit(model.rules).run(model.attributes);
	}

	canRead () {
		return Promise.resolve(this);
	}

	canEdit (session) {
		if (session.person.id !== this.get('person_id')) {
			throw new Exception.NotAllowed('You cannot edit this comment');
		}
		return Promise.resolve(this);
	}

	static byPlan (planId) {
		if (!planId) {
			throw new Exception.BadRequest('Must provide planId');
		}
		return this.query('where', 'plan_id', '=', planId)
			.query((qb) => {
				qb.orderBy('id', 'DESC');
			})
			.fetchAll({
				withRelated: [
					{
						person (qb) {
							qb.column('id', 'name');
						}
					}
				]
			});
	}

	static canCreate (session) {
		if (!session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return Promise.resolve(this);
	}
}

module.exports = Comment;
