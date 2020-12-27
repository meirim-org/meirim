const Model = require('./base_model');
const tpc = require('./tree_permit_constants');
const Log = require('../lib/log');

class TreePermit extends Model {

	get rules() {
		return {

			[tpc.REGIONAL_OFFICE]: 'string',
			[tpc.PERMIT_NUMBER]: 'string',
			[tpc.ACTION]: 'string', // cutting , copying
			[tpc.PERMIT_ISSUE_DATE]: 'string',
			[tpc.PERSON_REQUEST_NAME]: 'string',
			[tpc.START_DATE]: ['required', 'string'],
			[tpc.END_DATE]: 'string',
			[tpc.LAST_DATE]: 'string',
			[tpc.APPROVER_NAME]: 'string',
			[tpc.APPROVER_TITLE]: 'string',

			[tpc.SENT]: 'integer',
			[tpc.URL]: 'string',

			// Location
			[tpc.PLACE]: 'string',
			[tpc.STREET]: 'string',
			[tpc.STREET_NUMBER]: 'string',
			[tpc.GUSH]: 'string',
			[tpc.HELKA]: 'string',
			[tpc.GEOM]: 'object',
			
			// Trees details
			[tpc.TREES_PER_PERMIT]: 'required',
			[tpc.TOTAL_TREES]: 'integer',
			[tpc.REASON_SHORT]: 'string',
			[tpc.REASON_DETAILED]: 'string',
			[tpc.COMMENTS_IN_DOC]: 'string'
		};
	}

	get tableName () {
		return `${tpc.TREE_PERMIT_TABLE}`;
	}

	// support json encode for data field
	format (attributes) {
		if (attributes[tpc.TREES_PER_PERMIT]) {
			attributes[tpc.TREES_PER_PERMIT] = JSON.stringify(attributes[tpc.TREES_PER_PERMIT]);
		}
		return super.format(attributes);
	}

	// support json encode for data field
	parse (attributes) {
		try {
			if (attributes[tpc.TREES_PER_PERMIT]) {
				attributes[tpc.TREES_PER_PERMIT] = JSON.parse(attributes[tpc.TREES_PER_PERMIT]);
			}
		} catch (e) {
			Log.error('Json parse error', attributes[tpc.TREES_PER_PERMIT]);
		}
		return super.parse(attributes);
	}

	defaults () {
		return {
			sent: 0
		};
	}

	get geometry () {
		return ['geom'];
	}
}

module.exports = TreePermit;
