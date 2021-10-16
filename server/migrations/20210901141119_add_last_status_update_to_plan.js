
exports.up = function(knex) {
	return knex.schema.table('plan', table => {
		table.timestamp('last_status_update', );
	})
		.then(() => knex('plan').update('last_status_update', knex.ref('updated_at')));
};

exports.down = function(knex) {
	return knex.schema.table('plan', table => {
		table.dropColumns(
			'last_status_update'		
		);
	});
};
