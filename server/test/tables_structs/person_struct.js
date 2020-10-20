const PersonStruct = function(table) {
	table.increments();
	table.integer('admin');
	table.string('password');
	table.string('email');
	table.integer('status');
	table.timestamps();
	return table;
};

module.exports = PersonStruct;