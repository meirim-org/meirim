const Model = require('./base_model');

class PlanChartFiveRow extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			designation: 'string',
			use: 'string',
			area_number: 'string',
			location: 'string',
			field_size_sqm: 'string',
			above_primary_main: 'string',
			above_primary_service: 'string',
			below_primary_main: 'string',
			below_primary_service: 'string',
			building_percentage: 'string',
			tahsit: 'string',
			density_yahad_to_dunam: 'string',
			num_of_housing_units: 'string',
			floors_above: 'string',
			floors_below: 'string',
			overall_building_band: 'string',
			height_above_entrance: 'string',
			side_line_right: 'string',
			side_line_left: 'string',
			side_line_back: 'string',
			side_line_front: 'string'
		};
	}

	get tableName () {
		return 'table_5_building_rights';
	}
}

module.exports = PlanChartFiveRow;
