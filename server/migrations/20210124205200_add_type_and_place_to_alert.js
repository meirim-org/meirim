
exports.up = async function (knex) {
	await knex.schema.alterTable('alert', table => {
		table.string('type').notNullable().defaultTo('plan');
		table.string('place');
		table.string('address').nullable().alter();
		table.string('radius').nullable().alter();
	});
};

exports.down = async function (knex) {
	await knex.schema.table('alert', table => {
		table.dropColumns(
			'place',
			'type'
		);
		table.string('address').notNullable().alter();
		table.string('radius').notNullable().alter();
	});
};
