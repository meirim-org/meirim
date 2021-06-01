const ChartFourStruct = function(table) {
	table.increments();
	table.integer('plan_id');
	table.integer('tree_id');
	table.string('link').notNullable();
	table.string('source').notNullable();
	table.string('extension').notNullable();
	table.string('name').notNullable();
	table.string('type'); 
	table.timestamp('created_at');
	return table;
};

module.exports = ChartFourStruct;
