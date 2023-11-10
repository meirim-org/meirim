exports.up = function (knex) {
				return knex.schema.createTable('scheduled_tasks', table => {
								table.increments('id').primary();
								table.integer('person_id');
								table.integer('subscription_id');
								table.string('date');
				});
};

exports.down = function (knex) {
				return knex.schema.dropTable('scheduled_tasks');
};
