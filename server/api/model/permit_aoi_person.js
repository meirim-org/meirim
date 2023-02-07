const Model = require('./base_model');
const PermitAoi = require('./permit_aoi');
const consts = require('./permit_constants');

class PermitAoiPerson extends Model {
	get rules() {
		return {
			[consts.PERMIT_AOI_ID]: 'integer',
			[consts.PERSON_ID]: 'integer',
			[consts.NAME]: 'string',
		};
	}

	get tableName () {
		return `${consts.PERMIT_AOI_PERSON_TABLE}`;
	}
	
	permit_aoi () {
		return this.belongsTo(PermitAoi);
	}

	static canCreate(session) {
		if (!session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return Promise.resolve(this);
	}
}

module.exports = PermitAoiPerson;
