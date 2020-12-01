const CommentStruct = function(table) {
	table.increments();
	table.integer('person_id');
	table.string('content');
	table.string('type');
	table.integer('likes');
	table.integer('plan_id');
	table.integer('parent_id');
	table.timestamps();
	return table;
};

module.exports = CommentStruct;