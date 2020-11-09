const ChartOneEightStruct = function(table) {
    table.increments();
    table.integer('plan_id');
    table.string('origin', 10);
    table.string('profession', 300);
    table.string('type', 300);
    table.string('description', 300);
    table.string('name', 300);
    table.string('license_number', 300);
    table.string('corporate', 300);
    table.string('city', 300);
    table.string('street', 300);
    table.string('house', 300);
    table.string('phone', 300);
    table.string('fax', 300);
    table.string('email', 300);
	return table;
};

module.exports = ChartOneEightStruct;
