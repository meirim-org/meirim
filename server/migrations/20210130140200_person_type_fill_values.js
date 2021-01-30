exports.up = async function(knex) {
	// populate existing persons type values
	await knex.raw('UPDATE person SET type = \'תושב/ת עם רצון לדעת ולהשפיע\' WHERE type IS NULL');

	// make person required columns not nullable
	await knex.schema.alterTable('person', table => {
		table.string('email').notNullable().alter();
		table.string('password').notNullable().alter();
		table.string('status').notNullable().alter();
		table.string('admin').defaultTo(0).notNullable().alter();
		table.string('name').notNullable().alter();
		table.string('type').notNullable().alter();
	});
};

exports.down = async function(knex) {
	// change required columns to be nullable but don't change type values
	// since this migration was created after the version deploy and so some
	// users have chosen their types (unlike the old users who had NULL for type)
	await knex.schema.alterTable('person', table => {
		table.string('email').nullable().alter();
		table.string('password').nullable().alter();
		table.string('status').nullable().alter();
		table.string('admin').defaultTo(0).nullable().alter();
		table.string('name').nullable().alter();
		table.string('type').nullable().alter();
	});
};
