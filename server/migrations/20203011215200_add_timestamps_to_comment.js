exports.up = function(knex) {
	return knex.schema.table('comment', table => {
		table.timestamps();
		table.integer('likes');
    table.string('type');
	});
};

exports.down = function(knex) {
	return knex.schema.table('comment', table => {
		table.dropColumns(
			'updated_at',
			'created_at',
			'likes',
			'type'
		);
	});
};
