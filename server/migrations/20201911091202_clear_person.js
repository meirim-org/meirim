exports.up = function(knex) {
	return knex.schema.table('person', table => {
		table.dropColumns("firstName", "lastName", "alias")
	});
};

exports.down = function(knex) {};