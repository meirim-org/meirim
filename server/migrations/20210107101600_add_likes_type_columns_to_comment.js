exports.up = function(knex) {
	return knex.schema.table('comment', table => {
		table.integer('likes');
		table.string('type');
	}).then(() =>
		// fill in missing data for old comments - type field
		knex.raw('UPDATE comment SET type = \'general\'')
	).then(() =>
		// previous version treated comments with parent_id = 0 as root comments,
		// but now parent_id = NULL are root comments
		knex.raw('UPDATE comment SET parent_id = NULL WHERE parent_id = 0')
	);
};

exports.down = function(knex) {
	// change root comments' parent_id back to 0
	return knex.raw('UPDATE comment SET parent_id = 0 WHERE parent_id IS NULL')
	.then(() => knex.schema.table('comment', table => {
		table.dropColumns(
			'likes',
			'type'
		);
	}));
};
