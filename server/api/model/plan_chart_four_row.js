const Model = require('./base_model');

class PlanChartFourRow extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			category_number: 'string', // for example: 4.1.1 or 4.3.4
			category: 'string', // name of the category
			father_category_number: 'string', // for example: 4.1 or 4.3
			father_category: 'string', // name of the father category
			text: 'string'
		};
	}

	get tableName () {
		return 'table_4_area_designation_and_usage';
	}

	static async getFatherCategoriesOfPlan (planId) {
		return PlanChartFourRow.query(qb => {
			qb.where('plan_id', '=', planId);
		}).fetchAll({
			columns: [
				'id',
				'father_category'
			]
		});
	}
}

module.exports = PlanChartFourRow;
