const chartPlanAreaChanges = t => {
    t.increments('id').primary();
    t.integer('plan_id');
    t.text('usage');
    t.text('measurement_unit');
    t.text('approved_state');
    t.text('change_to_approved_state');
    t.text('total_in_detailed_plan');
    t.text('total_in_mitaarit_plan');
    t.text('remarks');
};

module.exports = chartPlanAreaChanges;