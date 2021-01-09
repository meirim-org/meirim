exports.up = function(knex) {
	return knex.schema
		.createTable('funding_transaction', table => {
			table.integer('yaad_id').primary();
			table.boolean('recurring').notNullable();
			table.integer('amount').notNullable();
			table.timestamps();
		});
};

exports.down = function(knex) {
	return knex.schema.dropTable('funding_transaction');
};
