
const tpc = require('../api/model/tree_permit_constants');

exports.up = async function (knex) {
	await knex.schema.alterTable(tpc.TREE_PERMIT_TABLE, t => {
		//Add
		t.integer(tpc.SENT);
		t.specificType(tpc.GEOM, 'GEOMETRY');
		t.text(tpc.TREES_PER_PERMIT, 65535);
		t.integer(tpc.TOTAL_TREES);

		//Delete
		t.dropColumn(tpc.TREE_NAME);
		t.dropColumn(tpc.TREE_KIND);
		t.dropColumn(tpc.NUMBER_OF_TREES);

	});
};

exports.down = async function (knex) {
	await knex.schema.alterTable(tpc.TREE_PERMIT_TABLE, t => {
		t.dropColumn(tpc.SENT);
		t.dropColumn(tpc.GEOM);
		t.dropColumn(tpc.TREES_PER_PERMIT);
		t.dropColumn(tpc.TOTAL_TREES);

		t.string(tpc.TREE_NAME);
		t.string(tpc.TREE_KIND);
		t.string(tpc.NUMBER_OF_TREES);

	});
};
