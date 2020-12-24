exports.up = function(knex) {
	return knex.schema.table('comment', table => {
		table.integer('likes');
    table.string('type');
	});
};

exports.down = function(knex) {
	return knex.schema.table('comment', table => {
		table.dropColumns(
			'likes',
			'type'
		);
	});
};
