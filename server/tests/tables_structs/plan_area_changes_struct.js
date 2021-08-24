const PlanAreaChangesStruct = function(table) {
	table.increments();
	table.integer('plan_id');
	table.text('usage');
	table.text('measurement_unit');
	table.text('approved_state');
	table.text('change_to_approved_state');
	table.text('total_in_detailed_plan');
	table.text('total_in_mitaarit_plan');
	table.text('remarks');
    return table;
};

module.exports = PlanAreaChangesStruct;
