const PlanLinksStruct = function(table) {
	table.increments('id').primary();
	table.string('url').notNullable();
	table.string('link_title').notNullable();
	table.string('link_type').defaultTo('web');
	table.string('link_description');
	table.integer('plan_id');	
	return table;
};

module.exports = PlanLinksStruct;
