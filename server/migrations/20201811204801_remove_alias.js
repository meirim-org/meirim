exports.up = function(knex) {
	return knex.schema.table('person', table => {
		table.dropColumns("alias")
	});
};

exports.down = function() {};
