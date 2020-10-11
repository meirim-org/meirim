const PlanStruct = function(table) {
	table.increments();
	table.integer('sent');
	table.integer('OBJECTID');
	table.string('PLAN_COUNTY_NAME');
	table.string('PL_NUMBER');
	table.string('PL_NAME');
	table.string('data');
	table.string('PLAN_CHARACTOR_NAME');
	table.string('plan_url');
	table.string('status');
	table.string('geom');
	// table.object('geom');
	table.string('jurisdiction');
	table.string('areaChanges');
	table.integer('rating');
	table.timestamps();
	return table;
};

module.exports = PlanStruct;