const ArchiveNotificationFactory = function(table) {
	table.increments();
	table.integer('plan_id');
	table.integer('person_id');
	table.boolean('seen');
	table.string('type');
	table.timestamps();
	return table;
};

module.exports = ArchiveNotificationFactory;