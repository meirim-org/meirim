const ChartSixStruct = function(table) {
    table.increments();
    table.integer('plan_id');
    table.string('category_number', 50);
    table.string('category', 100);
    table.text('text');
	return table;
};

module.exports = ChartSixStruct;
