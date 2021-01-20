const Checkit = require('checkit');
const merge = require('lodash/merge');
const Model = require('./base_model');
const Person = require('./person');
const Exception = require('./exception');
const CommentPerson = require('./comment_person');

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


	static  async byPlan (planId) {
		if (!planId) {
			throw new Exception.BadRequest('Must provide planId');
		}
		const result = await this.query('where', 'plan_id', '=', planId)
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
		const res = await Promise.all(result.models.map(async m => {
			const likes = await CommentPerson.getLikesNumber(m.attributes.id );
			return(merge(m, { attributes:{ likes } }));
		}));

		return res;
	}

	static canCreate (session) {
		if (!session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return Promise.resolve(this);
	}
}

module.exports = Comment;

