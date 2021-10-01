const Model = require('./base_model');
const Plan = require('./plan');

class StaticMap extends Model {
	get rules() {
		return {
			plan_id: 'integer',
			// tree_id: 'integer',
			base64string: 'string',
		};
	}

	get tableName() {
		return 'staticmap';
	}

	plan () {
		return this.belongsTo(Plan);
	}

	defaults() {
		return {
		};
	}
}

module.exports = StaticMap;
