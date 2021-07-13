const Model = require('./base_model');

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
		}

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
		if (!planId) {
			throw new Exception.BadRequest('Must provide planId');
		}
		return Knex('plan_tag')
			.join('tag', 'tag.id', 'plan_tag.tag_id')
			.select('tag.name','tag.display_name')
			.where({ plan_id: planId })
	}

	static deletePlanTags ( planId) {
		return this.query('where', 'plan_id', '=', planId)
			.destroy()
			.then(() => true);
	}

	static createPlanTags ( planId) {
		// TODO recreate plan tags
	}
	
	static async createPlanTag({ tagId, planId, displayScore, createdByDataRules }) {
		await Bookshelf.transaction(async (transaction) => {
				const data = {
					tag_id: tagId,
					plan_id: planId,
					display_score: displayScore,
					created_by_data_rules: createdByDataRules

				};

				await new PlanTag(data).save(null, {transacting: transaction});
		});
	}	
}
module.exports = PlanTag;
