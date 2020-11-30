exports.up = function(knex) {
	return knex.schema.table('comment', table => {
		table.timestamps();
	});
};

exports.down = function(knex) {
	return knex.schema.table('comment', table => {
		table.dropColumns(
			'updated_at',
			'created_at',
		);
	});
};
