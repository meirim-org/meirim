const Checkit = require('checkit');
const Model = require('./base_model');
const tpc = require('./tree_permit_constants');
class TreePermit extends Model {

	get rules() {

		return {

			[tpc.REGIONAL_OFFICE]: 'string',
			[tpc.PERMIT_NUMBER]: 'string',
			[tpc.ACTION]: 'string', // cutting , copying
			[tpc.PERMIT_ISSUE_DATE]: 'string',
			[tpc.PERSON_REQUEST_NAME]: 'string',
			[tpc.START_DATE]: 'string',
			[tpc.END_DATE]: 'string',
			[tpc.LAST_DATE]: 'string',
			[tpc.APPROVER_NAME]: 'string',
			[tpc.APPROVER_TITLE]: 'string',

			// Location
			[tpc.PLACE]: 'string',
			[tpc.STREET]: 'string',
			[tpc.STREET_NUMBER]: 'string',
			[tpc.GUSH]: 'string',
			[tpc.HELKA]: 'string',
			
			// Trees details
			[tpc.TREE_NAME]: 'string',
			[tpc.TREE_KIND]: 'string',
			[tpc.NUMBER_OF_TREES]: 'integer',
			[tpc.REASON_SHORT]: 'string',
			[tpc.REASON_DETAILED]: 'string',
			[tpc.COMMENTS_IN_DOC]: 'string'

		};

	}

	get tableName () {
		return 'tree_permit';
	}

	_saving (model) {		
		return new Checkit(model.rules).run(model.attributes);	
	}
}

module.exports = TreePermit;
