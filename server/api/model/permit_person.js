const Model = require('./base_model');
const Permit = require('./permit');
const consts = require('./permit_constants');
const Person = require('./person');

class PermitPerson extends Model {
	get rules() {
		return {
			[consts.PERMIT_ID]: 'integer',
			[consts.PERSON_ID]: 'integer',
		};
	}

	get tableName() {
		return `${consts.PERMIT_PERSON_TABLE}`;
	}

	person() {
		return this.belongsTo(Person);
	}

	permit() {
		return this.belongsTo(Permit)
	}

	static canCreate(session) {
		if (!session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return Promise.resolve(this);
	}
}

module.exports = PermitPerson;
