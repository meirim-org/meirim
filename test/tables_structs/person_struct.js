const PersonStruct = function(table) {
	table.increments();
	table.email('admin');
	table.string('password');
	table.integer('status');
	table.integer('admin');
	table.json('subscribed_tags');
	table.timestamps();
	return table;
};

module.exports = PersonStruct;