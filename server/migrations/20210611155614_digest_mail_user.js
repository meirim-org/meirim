
exports.up = async function(knex) {
	await knex.schema.table('alert', table => {
		table.datetime('last_email_sent');
	});
};

exports.down = function(knex) {
	return knex.schema.table('alert', table => {
		table.dropColumns('last_email_sent');
	});
};
