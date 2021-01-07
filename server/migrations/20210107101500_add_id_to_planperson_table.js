exports.up = async function(knex) {
	// change the previously-set composite primary key to a single-field
	// auto increment id key since bookshelf does not support composite
	// primary keys at this time:
	// https://github.com/bookshelf/bookshelf/issues/1664
	await knex.schema.table('plan_person', table => {
		table.dropPrimary(['person_id', 'plan_id']);
	});
	await knex.schema.table('plan_person', table => {
		table.increments('id').primary();
	});
};

exports.down = async function(knex) {
	await knex.schema.table('plan_person', table => {
		table.dropColumns('id');
	});
	await knex.schema.table('plan_person', table => {
		table.primary(['person_id', 'plan_id']);
	})
};