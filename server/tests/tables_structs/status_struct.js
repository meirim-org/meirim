const StatusStruct = function(table) {
	table.integer('id').primary();
	table.string('name');
	table.string('explanation', 512);
	table.integer('step_id');
	return table;
};

module.exports = StatusStruct;