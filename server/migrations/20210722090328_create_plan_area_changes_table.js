exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('plan_area_changes', t => {
        t.increments('id').primary();
        t.integer('plan_id');
        t.text('usage');
        t.text('measurement_unit').notNullable();
        t.text('approved_state').notNullable();
        t.text('change_to_approved_state').notNullable();
        t.text('total_in_detailed_plan').notNullable();
        t.text('total_in_mitaarit_plan').notNullable();
        t.text('remarks').notNullable();
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('file');
};
