
exports.up = async function(knex) {
	await knex.schema.createTableIfNotExists('plan_status_change', t => {
		t.increments('id').primary();
		
		t.string('plan_id');
		t.string('status');
		t.string('date');
		t.string('status_description');
		t.timestamps(true, true);
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('plan_status_change');
};
