const tpc = require('../api/model/tree_permit_constants');

exports.up = async function (knex) {
	await knex.schema.alterTable(tpc.TREE_PERMIT_TABLE, t => {
		t.datetime(tpc.START_DATE).alter();
		t.datetime(tpc.END_DATE).alter();
		t.datetime(tpc.LAST_DATE_TO_OBJECTION).alter();
		t.datetime(tpc.PERMIT_ISSUE_DATE).alter();
	});
};

exports.down = async function (knex) {
	await knex.schema.alterTable(tpc.TREE_PERMIT_TABLE, t => {
		t.string(tpc.START_DATE).alter();
		t.string(tpc.END_DATE).alter();
		t.string(tpc.LAST_DATE_TO_OBJECTION).alter();
		t.string(tpc.PERMIT_ISSUE_DATE).alter();
	});
};
