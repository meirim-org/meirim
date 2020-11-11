exports.up = function(knex) {
	return knex.schema.table('person', table => {
		table.string("address")
	});
};

exports.down = function(knex) {
	return knex.schema.table('person', table => {
		table.dropColumns(
			"address"
		);
	});
};
