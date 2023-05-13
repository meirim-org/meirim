const StatusMappingStruct = function(table) {
	table.increments('id').primary();
	table.string('mavat_status', 255);
	table.string('meirim_status', 255);
	return table;
};

module.exports = StatusMappingStruct;