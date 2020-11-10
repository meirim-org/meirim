exports.up = function(knex) {
	return knex.schema.hasTable('plan_status').then(exists => {
		if (!exists)
			return knex.schema.createTable('plan_status', t => {
				t.increments('id').primary();
				t.integer('plan_id').notNullable();
				t.string('status').notNullable();
				t.date('date').notNullable();
			});
		else
			return Promise.resolve();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('plan_status');
};
