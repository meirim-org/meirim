const ArchiveNotificationFactory = function(table) {
	table.increments();
	table.integer('plan_id');
	table.integer('person_id');
	table.timestamps();
	return table;
};

module.exports = ArchiveNotificationFactory;