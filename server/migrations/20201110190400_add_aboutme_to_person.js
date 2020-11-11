exports.up = function(knex) {
	return knex.schema.table('person', table => {
		table.string("about_me")
	});
};

exports.down = function(knex) {
	return knex.schema.table('person', table => {
		table.dropColumns(
			"about_me"
		);
	});
};
