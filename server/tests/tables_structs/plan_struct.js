const PlanStruct = function(table) {
	table.increments();
	table.integer('sent');
	table.integer('OBJECTID');
	table.string('goals_from_mavat');
	table.string('main_details_from_mavat');
	table.string('PLAN_COUNTY_NAME');
	table.string('PL_NUMBER');
	table.string('PL_NAME');
	table.text('data', 65535);
	table.string('PLAN_CHARACTOR_NAME');
	table.string('plan_url');
	table.string('status');
	table.binary('geom');
	table.string('jurisdiction');
	table.string('areaChanges');
	table.text('explanation', 65535);
	table.integer('rating');
	table.timestamps();
	return table;
};

module.exports = PlanStruct;