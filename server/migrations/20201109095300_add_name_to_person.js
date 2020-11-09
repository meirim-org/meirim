exports.up = function(knex) {
	return knex.schema.table('person', table => {
		table.string("name")
	});
};

exports.down = function(knex) {
	return knex.schema.table('person', table => {
		table.dropColumns(
			"name"
		);
	});
};
