const PlanStatusChangeStruct = function(table) {
	table.integer('id').primary();
	table.string('plan_id', 255);
	table.string('status', 255);
	table.date('date');
	table.string('status_description', 255);
	table.timestamps(true, true);
	return table;
};

module.exports = PlanStatusChangeStruct;