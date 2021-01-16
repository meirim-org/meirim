const PlanPersonStruct = function(table) {
	table.increments('id').primary();
	table.integer('person_id');
	table.integer('plan_id');
	return table;
};

module.exports = PlanPersonStruct;