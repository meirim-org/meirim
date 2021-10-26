exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('file', t => {
        t.increments('id').primary();
        t.integer('plan_id');
        t.integer('tree_id');
        t.string('link').notNullable();
		t.string('source').notNullable();
        t.string('extension').notNullable();
        t.string('name').notNullable();
		t.string('type'); 
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('file');
};
