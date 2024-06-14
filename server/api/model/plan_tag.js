const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const Tag = require('./tag');
const { Bookshelf, Knex } = require('../service/database');
const moment = require('moment');

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

	static async createPlanTags(plan_id, data) {
		try {
			await Bookshelf.transaction(async (transaction) => {
				for (const datum in data) {
					await new PlanTag(data[datum]).save(null, { transacting: transaction });
				}

			});

			const curr_time = moment().format('YYYY-MM-DD HH:mm:ss');
			await Knex.raw(`UPDATE plan SET last_tags_update = ? WHERE id = ?`, [curr_time, plan_id]);

		} catch (err) {
			Log.error('had a problem saving tags for plan ' + plan_id + '\n' + err);
		}

	}	



}

module.exports =  PlanTag;
