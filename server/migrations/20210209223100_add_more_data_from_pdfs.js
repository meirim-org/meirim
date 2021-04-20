
exports.up = async function(knex, Promise) {

    await knex.schema.createTableIfNotExists("table_1_6_prev_plans_relations", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id')
            .inTable('plan').onDelete('CASCADE');
        t.text("prev_plan_number");
        t.text("kind");
        t.text("comment");
        t.text("yalkoot_number");
        t.text("yalkoot_page_number");  //data is in string form, we can't assume that it will be a nice integer
        t.text("date");
    });

    await knex.schema.createTableIfNotExists("table_1_7_plan_docs", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id')
            .inTable('plan').onDelete('CASCADE');
        t.text("kind");
        t.text("contains");
        t.text("scale");
        t.text("number_of_pages");
        t.text("edit_date");  //data is in string form, we can't assume that it will be a nice integer
        t.text("editor");
        t.text("creation_date");
        t.text("description");
        t.text("included");
    });

    await knex.schema.createTableIfNotExists("table_3_1_without_change", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id')
            .inTable('plan').onDelete('CASCADE');
        t.text("designation");
        t.text("field_cells");
    });

    await knex.schema.createTableIfNotExists("table_3_1_with_change", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id')
            .inTable('plan').onDelete('CASCADE');
        t.text("tasrit_marking");
        t.text("designation");
        t.text("field_cells");
    });


    await knex.schema.createTableIfNotExists("table_3_2_areas_table", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id')
            .inTable('plan').onDelete('CASCADE');
        t.text("designation");
        t.text("size_in_mr");
        t.text("percentage");
        t.boolean('is_current_state');
    });


    await knex.schema.createTableIfNotExists("table_7_1_implementation_stages", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id')
            .inTable('plan').onDelete('CASCADE');
        t.text("phase");
        t.text("phase_description");
        t.text("conditioning");
    });


    await knex.schema.table('plan', (table) => {
        table.text('kind_of_plan');
        table.text('laws');
        table.text('permit');
        table.text('union_and_division');
    });

};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('table_1_6_prev_plans_relations');
    await knex.schema.dropTableIfExists('table_1_7_plan_docs');
    await knex.schema.dropTableIfExists('table_3_1_without_change_area_designation_and_cells');
    await knex.schema.dropTableIfExists('table_3_1_with_change_area_designation_and_cells');
    await knex.schema.dropTableIfExists('table_3_2_areas_table');
    await knex.schema.dropTableIfExists('table_7_1_implementation_stages');

    await knex.schema.table('plan', table => {
        table.dropColumns(['kind_of_plan', 'laws', 'permit', 'union_and_division']);
    });
};
