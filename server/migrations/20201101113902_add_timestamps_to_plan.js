exports.up = function(knex) {
	return knex.schema.table('plan', table => {
		table.timestamps();
	});
};

exports.down = function(knex) {
	return knex.schema.table('plan', table => {
		table.dropColumns(
			'updated_at',
			'created_at',
		);
	});
};
