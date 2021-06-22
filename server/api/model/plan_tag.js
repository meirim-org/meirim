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
}
module.exports = Tag;
