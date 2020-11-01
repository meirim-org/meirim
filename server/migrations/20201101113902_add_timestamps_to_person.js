exports.up = function(knex) {
	return knex.schema.table('person', table => {
		table.timestamps();
	});
};

exports.down = function(knex) {
	return knex.schema.table('person', table => {
		table.dropColumns(
			'updated_at',
			'created_at',
		);
	});
};
