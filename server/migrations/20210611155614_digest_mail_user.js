
exports.up = async function(knex) {
	await knex.schema.table('alert', table => {
		table.datetime('last_email_sent');
	});

	await knex.schema.createTableIfNotExists('staticmap', t => {
        t.increments('id').primary();
        t.integer('plan_id');
		t.text('base64string', 'longtext');
    });
};

exports.down = function(knex) {
	await knex.schema.table('alert', table => {
		table.dropColumns('last_email_sent');
	});

	await knex.schema.dropTableIfExists('staticmap');
};
