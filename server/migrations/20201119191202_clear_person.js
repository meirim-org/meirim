exports.up = function(knex) {
	return knex.schema.table("person", table => {
		table.dropColumns("firstName", "lastName", "alias")
	});
};

exports.down = function(knex) {
	return knex.schema.table("person", table => {
		table.string("firstName", 36).nullable();
		table.string("lastName", 36).nullable();
		table.string("alias").unique().nullable();
	});
};
