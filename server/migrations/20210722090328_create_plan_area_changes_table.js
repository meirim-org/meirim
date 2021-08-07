exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('plan_area_changes', t => {
        t.increments('id').primary();
        t.integer('plan_id');
        t.text('usage');
        t.text('measurement_unit');
        t.text('approved_state');
        t.text('change_to_approved_state');
        t.text('total_in_detailed_plan');
        t.text('total_in_mitaarit_plan');
        t.text('remarks');
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('plan_area_changes');
};
