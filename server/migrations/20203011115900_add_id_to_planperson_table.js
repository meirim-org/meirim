exports.up = function(knex) {
	return knex.schema.table('plan_person', table => {
		table.integer('id');
	});
};

exports.down = function(knex) {};