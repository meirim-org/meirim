const PersonStruct = function(table) {
	table.increments();
	table.integer('admin');
	table.string('password');
	table.string('type');
	table.string('name');
	table.string('social_network_url');
	table.string('about_me');
	table.string('email');
	table.integer('status');
	table.timestamps();
	return table;
};

module.exports = PersonStruct;