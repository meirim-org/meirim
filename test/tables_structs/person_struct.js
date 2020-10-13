const PersonStruct = function(table) {
	table.increments();
	table.integer('admin');
	table.string('password');
	table.string('email');
	table.integer('status');
	table.json('subscribed_tags');
	table.timestamps();
	return table;
};

module.exports = PersonStruct;