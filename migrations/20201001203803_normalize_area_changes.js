const {normalize_area_changes} = require('../bin/normalize_area_changes');

exports.up = async function(knex) {
    await knex.schema.createTableIfNotExists("plan_area_changes", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id').inTable('plan');
        t.text("usage");  // like מגורים (יח"ד)
        t.text("measurement_unit");    // like יח"ד
        t.text("approved_state");   // like +64
        t.text("change_to_approved_state");    // like -4 or +2
        // סה"כ מוצע בתוכנית מפורטת
        t.text("total_in_detailed_plan");      // like 547
        // סה"כ מוצע בתוכנית מתארית
        t.text("total_in_mitaarit_plan");
        // הערות
        t.text('remarks');
    });
    await normalize_area_changes(knex);
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('plan_area_changes');
};
