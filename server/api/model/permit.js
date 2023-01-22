const Model = require('./base_model');
const consts = require('./permit_constants');
const { mapKeys, camelCase } = require('lodash');

class Permit extends Model {
	get rules() {
		return {
			[consts.SUBJECT]: 'string',
			[consts.CREATED_AT]: 'timestamp',
			[consts.REGION]: 'string',
			[consts.REAL_ESTATE]: 'string',
			[consts.AUTHOR]: 'string',
			[consts.STATUS]: 'string',
			[consts.TIMELINE]: 'string',
			[consts.IMPORTANCE]: 'string',
		};
	}

	get tableName () {
		return `${consts.PERMIT_TABLE}`;
	}

	parse (attributes) {
		return mapKeys(attributes, function(_, key) {
			return camelCase('permit_' + key);
		  });
	}

}

module.exports = Permit;
