
exports.up = async function(knex) {
	await knex.schema.createTableIfNotExists('archive_notification', t => {
		t.increments('id').primary();
		t.integer('plan_id').notNullable().references('id')
			.inTable('plan').onDelete('CASCADE');
		t.integer('person_id');
		t.boolean('seen');
		t.string('type').notNullable();
		t.timestamps();
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('archive_notification');
};
