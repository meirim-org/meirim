exports.up = function(knex) {
	return knex.schema.table('person', table => {
		table.string("name")
		table.string("type")
		table.string("about_me")
		table.string("address")
	});
};

exports.down = function(knex) {
	return knex.schema.table('person', table => {
		table.dropColumns(
			"name",
			"type",
			"about_me",
			"address"
		);
	});
};

