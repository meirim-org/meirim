const Model = require('./base_model');
const consts = require('./permit_constants');

class PermitAoi extends Model {
	get rules() {
		return {
			[consts.TYPE]: 'enum',
			[consts.NAME]: 'string',
			[consts.GEOM]: 'object',
			[consts.VISIBILITY]: 'enum',
			[consts.URL]: 'string',
		};
	}

	get tableName () {
		return `${consts.PERMIT_AOI_TABLE}`;
	}

}

module.exports = PermitAoi;
