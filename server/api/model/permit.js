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

	get tableName() {
		return `${consts.PERMIT_TABLE}`;
	}

	parse(attributes) {
		if (attributes[consts.REAL_ESTATE]) {
			const rawRealEstate = attributes[consts.REAL_ESTATE]
			const gushHelkaRegex = /גוש:\s+(\d+),\s+חלקה:\s+(\d+)/
			const matches = rawRealEstate.match(gushHelkaRegex)
			if (matches) {
				attributes[consts.REAL_ESTATE] = {
					gush: matches[1], helka: matches[2],
					mapUrl: `https://www.govmap.gov.il/?q=%D7%92%D7%95%D7%A9%20${matches[1]}`
				}
			}
		}
	
		return mapKeys(attributes, function (_, key) {
			return camelCase('permit_' + key);
		});
	}

}

module.exports = Permit;
