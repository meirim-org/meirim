exports.up = function(knex) {
	return knex.schema.table('person', table => {
		table.string("type")
	});
};

exports.down = function(knex) {
	return knex.schema.table('person', table => {
		table.dropColumns(
			"type"
		);
	});
};
