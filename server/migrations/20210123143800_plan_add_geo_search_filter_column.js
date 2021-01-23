exports.up = async function(knex, Promise) {
	await knex.schema.table('plan', table => {
		table.boolean('geo_search_filter');
	});

	// populate existing plans geo_search_filter values
	await knex.raw('UPDATE plan SET geo_search_filter = false');

	// make geo_search_filter column not nullable
	await knex.schema.alterTable('plan', table => {
		table.boolean('geo_search_filter').notNullable().alter();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table('plan', table => {
		table.dropColumns('geo_search_filter');
	});
};
