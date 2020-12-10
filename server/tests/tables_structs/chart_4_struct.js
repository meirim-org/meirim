const ChartFourStruct = function(table) {
    table.increments();
    table.integer('plan_id');
    table.string('category_number', 50);
    table.string('category', 100);
    table.string('father_category_number', 50);
    table.string('father_category', 100);
    table.text('text');
	return table;
};

module.exports = ChartFourStruct;
