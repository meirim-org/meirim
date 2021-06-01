const PlanStruct = function(table) {
	table.increments();
	table.integer('sent');
	table.integer('OBJECTID');
	table.text('goals_from_mavat');
	table.text('main_details_from_mavat', 65535);
	table.string('PLAN_COUNTY_NAME');
	table.string('PL_NUMBER');
	table.string('PL_NAME');
	table.text('data', 65535);
	table.string('PLAN_CHARACTOR_NAME');
	table.string('plan_url');
	table.string('status');
	table.specificType('geom', 'GEOMETRY');
	table.string('jurisdiction');
	table.string('areaChanges', 2048);
	table.text('explanation', 65535);
	table.float('rating').defaultTo(0);
	table.integer('views').defaultTo(0);
	table.integer('erosion_views').defaultTo(0);
	table.timestamps();
	table.specificType('geom_centroid', 'GEOMETRY');
	table.boolean('geo_search_filter');
	return table;
};

module.exports = PlanStruct;