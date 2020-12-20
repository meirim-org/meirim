const tpc = require('../api/model/tree_permit_constants');


exports.up = async function(knex) {
	await knex.schema.createTableIfNotExists('tree_permit', t => {
		t.increments('id').primary();
		
		//Who
		t.string(tpc.REGIONAL_OFFICE);
		t.string(tpc.PERMIT_NUMBER);
		t.string(tpc.ACTION);
		t.string(tpc.PERSON_REQUEST_NAME);
		t.string(tpc.APPROVER_NAME);
		t.string(tpc.APPROVER_TITLE);		
		
		//What
		t.string(tpc.TREE_NAME);
		t.string(tpc.TREE_KIND);
		t.string(tpc.NUMBER_OF_TREES);
		t.string(tpc.REASON_SHORT);
		t.string(tpc.REASON_DETAILED);
		t.string(tpc.COMMENTS_IN_DOC);

		//Where
		t.string(tpc.PLACE);
		t.string(tpc.STREET);
		t.string(tpc.STREET_NUMBER);
		t.string(tpc.GUSH);
		t.string(tpc.HELKA);
		
		//When
		t.string(tpc.PERMIT_ISSUE_DATE);
		t.string(tpc.START_DATE);
		t.string(tpc.END_DATE);		
		t.string(tpc.LAST_DATE_TO_OBJECTION);
		
		t.timestamps(true, true);
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('tree_permit');
};
