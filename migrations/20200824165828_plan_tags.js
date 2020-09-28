
exports.up = async function(knex) {
    await knex.schema.createTableIfNotExists("plan_tags", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id').inTable('plan');
        t.string("tag", 50);  // the name of the tag
        t.string("origin", 100);    // origin of the tag. for example: chart 5 or plan explanation or chart 4....
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('plan_tags');
};
