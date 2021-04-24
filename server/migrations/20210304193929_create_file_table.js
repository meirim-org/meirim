exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("file", t => {
        t.increments("id").primary();
        t.integer("person_id");
        t.integer("plan_id");
        t.integer("tree_id");
        t.string('link').notNullable();
		t.string('source').notNullable();
        t.string('file_extenstion').notNullable();
        t.string('name').notNullable();
		t.string('type'); 
        t.timestamp("created_at").defaultTo(knex.fn.now());
    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTableIfExists('file');
};
