const PlanTagStruct = function(table) {
	table.increments('id').primary();
	table.integer('tag_id')
		.unsigned()
		.references('id')
		.inTable('tag');
	table.integer('plan_id')
		.references('id')
		.inTable('plan');
	table.integer('display_score')
		.default(1);
	table.string('created_by_data_rules');
	table.boolean('created_by_child').default('false');
	table.boolean('child_is_stand_alone').default('false');
	table.datetime('creation_date');   // the real table defaults to the time of the creation of the table, but it doesn't really matter
};

module.exports = PlanTagStruct;

