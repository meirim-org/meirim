const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const Tag = require('./tag');
const { Bookshelf, Knex } = require('../service/database');

class PlanTag extends Model {
	get rules () {
		return {
			tag_id: ['required', 'integer'],
			plan_id: ['required', 'integer'],
			display_score: ['integer'],
			created_by_data_rules: ['string'],
			created_by_child: ['boolean'],
			child_is_stand_alone: ['boolean'],
			creation_date: ['datetime']
		};

	}

	get tableName () {
		return 'plan_tag';
	}

	canRead () {
		return true;
	}

	getCollection () {
		return this.collection();
	}

	static byPlan (planId) {
		Log.debug(`PlanTag.byPlan for ${planId}`);
		if (!planId) {
			throw new Exception.BadRequest('Must provide planId');
		}
		return Knex('plan_tag')
			.join('tag', 'tag.id', 'plan_tag.tag_id')
			.select('tag.name','tag.display_name')
			.where({ plan_id: planId });
	}

	static deletePlanTags ( planId) {
		return this.query('where', 'plan_id', '=', planId)
			.destroy({ require: false })
			.then(() => true);
	}

	// TODO: change to get array of tags rather than just one
	static async createPlanTags(data) {
		try {
			await Bookshelf.transaction(async (transaction) => {
				for (const datum in data) {
					await new PlanTag(data[datum]).save(null, { transacting: transaction });
				}
			});
		} catch (err) {
			Log.error(err);
		}

	}	



}

module.exports = PlanTag;
