const moment = require('moment');
exports.up = async function(knex) {

	await knex.schema.table('alert', table => {
		table.datetime('last_email_sent', moment().format('YYYY-MM-DD h:mm'));
	});

	await knex.schema.createTableIfNotExists('staticmap', t => {
		t.increments('id').primary();
		t.integer('plan_id');
		// t.integer('tree_id');
		t.longtext('base64string');
	});
};

exports.down = async function(knex) {
	await knex.schema.table('alert', table => {
		table.dropColumns('last_email_sent');
	});

	await knex.schema.dropTableIfExists('staticmap');
};