exports.up = function(knex) {
	return knex.schema.table('plan', table => {
		table.text('MP_ID');
		table.text('plan_new_mavat_url');
	});
};

exports.down = function(knex) {
	return knex.schema.table('plan', table => {
		table.dropColumns(
			'MP_ID',
			'plan_new_mavat_url',
		);
	});
};
