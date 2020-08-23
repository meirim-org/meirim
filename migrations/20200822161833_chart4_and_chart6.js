
exports.up = async function(knex) {
    await knex.schema.createTableIfNotExists("table_4_area_designation_and_usage", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id').inTable('plan');
        t.string("category_number", 50);  // for example: 4.1.1 or 4.3.4
        t.string("category", 100);    // name of the category
        t.string("father_category_number", 50);  // for example: 4.1 or 4.3
        t.string("father_category", 100);   // name of the father category
        t.text("text");
    });

    await knex.schema.createTableIfNotExists("table_6_additional_instructions", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id').inTable('plan');
        t.string("category_number", 50);  // for example: 6.1 or 6.3
        t.string("category", 100);    // name of the category
        t.text("text");
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('table_4_area_designation_and_usage');
    await knex.schema.dropTableIfExists('table_6_additional_instructions');
};
