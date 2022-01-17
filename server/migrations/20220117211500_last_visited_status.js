exports.up = function(knex) {
	return knex.schema.table('plan', table => {
		
		table.dropColumns(
			'last_status_update'		
		);
		table.timestamp('last_visited_status');
	});
};

exports.down = function(knex) {
	return knex.schema.table('plan', table => {
		table.timestamp('last_status_update', );
		table.dropColumns(
			'last_visited_status'		
		);
	}).then(() => knex('plan').update('last_status_update', knex.ref('updated_at')));
};
