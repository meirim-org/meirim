const Checkit = require('checkit');
const Model = require('./base_model');


class TreePermit extends Model {


	get rules() {

		return {

			sent: 'integer',
			OBJECTID: ['required', 'integer'], //TODO is it necassary? 
			region: 'string',
			permit_number: 'string',
			action: 'string', // cutting , copying
			permit_issue_date: 'string',
			person_request_name: 'string',
			start_date: 'string',
			end_date: 'string',
			last_date: 'string',
			approver_name: 'string',
			approver_title: 'string',

			// Location
			place: 'string',
			street: 'string',
			street_number: 'string',
			gush: 'string',
			helka: 'string',
			
			// Trees details
			tree_name: 'string',
			tree_kind: 'string',
			trees_number: 'integer',
			reason_short: 'string',
			reason_detailed: 'string',
			comments_in_doc: 'string'

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
